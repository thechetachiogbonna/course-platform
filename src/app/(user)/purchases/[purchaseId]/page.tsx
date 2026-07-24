import { db } from "@/database/db";
import { getCurrentUser } from "@/features/users/action";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Receipt,
  CreditCard,
  Package,
  Calendar,
  Hash,
  PlayCircle,
  Download,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stripe } from "@/config/stripe";

export const metadata: Metadata = {
  title: "Purchase Receipt",
  description: "View details for your purchase.",
};

interface PurchaseDetail {
  id: string;
  userId: string;
  productId: string;
  pricePaidInCents: number;
  productDetails: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    status: string;
  };
  stripeSessionId: string;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
  courseIds: string[];
  courseName: string | null;
}

const getPurchase = async (
  purchaseId: string,
  userId: string,
): Promise<PurchaseDetail | null> => {
  const result = await db.query(
    `
      SELECT
        p.id,
        p.user_id,
        p.product_id,
        p.price_paid_in_cents,
        p.product_details,
        p.stripe_session_id,
        p.refunded_at,
        p.created_at,
        p.updated_at,
        COALESCE(
          array_agg(cp.course_id) FILTER (WHERE cp.course_id IS NOT NULL),
          '{}'
        ) AS course_ids
      FROM purchases p
      LEFT JOIN course_products cp
        ON cp.product_id = p.product_id
      WHERE p.id = $1 AND p.user_id = $2
      GROUP BY p.id
    `,
    [purchaseId, userId],
  );

  if (!result.rows.length) return null;

  const row = result.rows[0];

  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    pricePaidInCents: row.price_paid_in_cents,
    productDetails: row.product_details,
    stripeSessionId: row.stripe_session_id,
    refundedAt: row.refunded_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    courseIds: row.course_ids,
    courseName: null,
  };
};

const getReceiptUrl = async (stripeSessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
      expand: ["payment_intent.latest_charge"],
    });

    const paymentIntent = session.payment_intent as any;
    if (paymentIntent?.latest_charge?.receipt_url) {
      return paymentIntent.latest_charge.receipt_url;
    }
  } catch (err) {
    console.error("Failed to fetch Stripe receipt URL:", err);
  }
  return null;
};

const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default async function PurchaseReceiptPage({
  params,
}: {
  params: Promise<{ purchaseId: string }>;
}) {
  const { purchaseId } = await params;
  const { user } = await getCurrentUser();
  const purchase = await getPurchase(purchaseId, user.id);

  if (!purchase) return notFound();

  const isRefunded = !!purchase.refundedAt;
  const productDetails = purchase.productDetails;
  const pricePaid = purchase.pricePaidInCents / 100;
  const originalPrice = productDetails.price;
  const discount = originalPrice - pricePaid;
  const hasDiscount = discount > 0;
  const receiptUrl = !isRefunded
    ? await getReceiptUrl(purchase.stripeSessionId)
    : null;

  return (
    <div className="w-full max-w-3xl mx-auto pb-28">
      {/* Back Link */}
      <Link
        href="/purchases"
        className="inline-flex items-center gap-2 text-brand-yellow hover:opacity-80 transition-opacity mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Back to Purchases
        </span>
      </Link>

      {/* Receipt Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-yellow/15 blur-xl w-20 h-20 -m-2" />
          <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center relative">
            {isRefunded ? (
              <Receipt className="w-7 h-7 text-red-400" />
            ) : (
              <CheckCircle2 className="w-7 h-7 text-brand-yellow" />
            )}
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Purchase Receipt
        </h1>
        <p className="text-sm text-[#c9c8ab] mt-1">
          {formatFullDate(purchase.createdAt)}
        </p>
        {isRefunded && (
          <span className="mt-3 px-3 py-1 rounded-md text-[11px] font-bold uppercase bg-red-900/50 text-red-300 border border-red-800/40">
            Refunded on {formatShortDate(purchase.refundedAt!)}
          </span>
        )}
        {!isRefunded && (
          <span className="mt-3 px-3 py-1 rounded-md text-[11px] font-bold uppercase bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/20">
            Payment Successful
          </span>
        )}
      </div>

      {/* Main Receipt Card */}
      <div
        className={`glass-card rounded-2xl overflow-hidden ${isRefunded ? "opacity-80" : "electric-glow"}`}
      >
        {/* Product Banner */}
        <div className="relative h-40 md:h-52 w-full">
          {productDetails.imageUrl ? (
            <Image
              src={productDetails.imageUrl}
              alt={productDetails.name}
              fill
              className={`object-cover ${isRefunded ? "grayscale" : ""}`}
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#1c1b1b]" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-[#131313]/60 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6">
            <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-1">
              {productDetails.name}
            </h2>
            <p className="text-sm text-[#c9c8ab] mt-1 line-clamp-1">
              {productDetails.description}
            </p>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Order Details Grid */}
          <div>
            <h3 className="text-[10px] font-bold text-[#929277] uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Hash className="w-3 h-3" />
              Order Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailRow
                icon={<Hash className="w-3.5 h-3.5" />}
                label="Order ID"
                value={purchase.id.slice(0, 8).toUpperCase()}
              />
              <DetailRow
                icon={<Calendar className="w-3.5 h-3.5" />}
                label="Purchase Date"
                value={formatShortDate(purchase.createdAt)}
              />
              <DetailRow
                icon={<CreditCard className="w-3.5 h-3.5" />}
                label="Stripe Session"
                value={purchase.stripeSessionId}
                mono
              />
              <DetailRow
                icon={<Package className="w-3.5 h-3.5" />}
                label="Product ID"
                value={purchase.productId.slice(0, 8).toUpperCase()}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#252524]" />

          {/* Payment Breakdown */}
          <div>
            <h3 className="text-[10px] font-bold text-[#929277] uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <CreditCard className="w-3 h-3" />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#c9c8ab]">
                  {productDetails.name}
                </span>
                <span className="text-sm text-white font-medium">
                  {formatPrice(originalPrice, { showZeroAsNumber: true })}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-yellow">Discount</span>
                  <span className="text-sm text-brand-yellow font-medium">
                    -{formatPrice(discount, { showZeroAsNumber: true })}
                  </span>
                </div>
              )}
              <div className="border-t border-[#252524] pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-white">Total Paid</span>
                <span
                  className={`text-lg font-bold ${isRefunded ? "text-[#929277] line-through" : "text-brand-yellow"}`}
                >
                  {formatPrice(pricePaid, { showZeroAsNumber: true })}
                </span>
              </div>
              {isRefunded && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-red-400">
                    Refunded
                  </span>
                  <span className="text-lg font-bold text-red-400">
                    +{formatPrice(pricePaid, { showZeroAsNumber: true })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#252524]" />

          {/* Customer Info */}
          <div>
            <h3 className="text-[10px] font-bold text-[#929277] uppercase tracking-widest mb-4">
              Billed To
            </h3>
            <div className="flex items-center gap-3">
              {user.image_url && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#252525] shrink-0">
                  <Image
                    src={user.image_url}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-[#929277]">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
        {!isRefunded && (
          <Link
            href={`/products/${purchase.productId}`}
            className="text-nowrap max-sm:px-2 w-full sm:w-auto px-6 py-3.5 bg-brand-yellow hover:brightness-110 active:scale-95 text-[#1b1d00] font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Go to Product
          </Link>
        )}
        {receiptUrl && (
          <Link
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nowrap max-sm:px-2 w-full sm:w-auto px-6 py-3.5 bg-[#141414] border border-[#353534] hover:bg-[#252525] active:scale-95 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </Link>
        )}
        <Link
          href="/purchases"
          className="text-nowrap max-sm:px-2 w-full sm:w-auto px-6 py-3.5 bg-[#1c1b1b] border border-[#252525] hover:bg-[#252525] active:scale-95 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-brand-yellow" />
          All Purchases
        </Link>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#141414]/90 rounded-xl border border-[#252525]">
      <div className="text-[#929277] mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-[#929277] uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm text-white truncate ${mono ? "font-mono text-xs" : "font-medium"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
