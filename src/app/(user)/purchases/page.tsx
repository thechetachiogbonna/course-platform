import { db } from "@/database/db";
import { getCurrentUser } from "@/features/users/action";
import { formatPrice } from "@/lib/utils";
import {
  Receipt,
  PlayCircle,
  Ban,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Purchases",
  description: "View your purchase history and manage your orders.",
};

interface Purchase {
  id: string;
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
  courseIds: string[];
}

const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  const result = await db.query(
    `
      SELECT
        p.id,
        p.product_id,
        p.price_paid_in_cents,
        p.product_details,
        p.stripe_session_id,
        p.refunded_at,
        p.created_at,
        COALESCE(
          array_agg(cp.course_id) FILTER (WHERE cp.course_id IS NOT NULL),
          '{}'
        ) AS course_ids
      FROM purchases p
      LEFT JOIN course_products cp
        ON cp.product_id = p.product_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    pricePaidInCents: row.price_paid_in_cents,
    productDetails: row.product_details,
    stripeSessionId: row.stripe_session_id,
    refundedAt: row.refunded_at,
    createdAt: row.created_at,
    courseIds: row.course_ids,
  }));
};

const formatPurchaseDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const truncateSessionId = (sessionId: string) => {
  if (sessionId.length <= 18) return sessionId;
  return `${sessionId.slice(0, 18)}…`;
};

export default async function PurchasesPage() {
  const { user } = await getCurrentUser();
  const purchases = await getUserPurchases(user.id);

  const totalSpent = purchases
    .filter((p) => !p.refundedAt)
    .reduce((sum, p) => sum + p.pricePaidInCents, 0);

  return (
    <div className="w-full max-w-5xl mx-auto pb-28">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            My Purchases
          </h2>
          <p className="text-[#c9c8ab] mt-1 text-base">
            Manage your invoices and track your learning investments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-6 py-4 rounded-xl flex flex-col">
            <span className="text-[10px] font-bold text-[#929277] uppercase tracking-widest">
              Total Spent
            </span>
            <span className="text-xl font-bold text-brand-yellow">
              {formatPrice(totalSpent / 100, { showZeroAsNumber: true })}
            </span>
          </div>
        </div>
      </header>

      {/* Empty State */}
      {purchases.length === 0 && (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mb-5">
            <ShoppingBag className="w-7 h-7 text-brand-yellow" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No purchases yet
          </h3>
          <p className="text-sm text-[#c9c8ab] max-w-md mb-6 leading-relaxed">
            You haven't made any purchases. Browse our products to start
            learning today.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-yellow hover:brightness-110 active:scale-95 text-[#1b1d00] px-6 py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all shadow-[0_4px_20px_rgba(198,207,0,0.25)]"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      )}

      {/* Purchase List */}
      <div className="space-y-6">
        {purchases.map((purchase) => {
          const isRefunded = !!purchase.refundedAt;
          const productDetails = purchase.productDetails;
          const firstCourseId = purchase.courseIds[0];

          return (
            <div
              key={purchase.id}
              className={`glass-card rounded-xl overflow-hidden flex flex-col lg:flex-row ${
                isRefunded ? "opacity-70" : "electric-glow"
              }`}
            >
              {/* Product Image */}
              <div
                className={`relative w-full lg:w-48 h-48 lg:h-auto overflow-hidden shrink-0 ${
                  isRefunded ? "grayscale" : ""
                }`}
              >
                {productDetails.imageUrl ? (
                  <Image
                    src={productDetails.imageUrl}
                    alt={productDetails.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#1c1b1b] flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-[#929277]" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {isRefunded ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-900/50 text-red-300 border border-red-800/40">
                          Refunded
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/20">
                          Completed
                        </span>
                      )}
                      <span className="text-xs font-medium text-[#929277]">
                        {formatPurchaseDate(purchase.createdAt)}
                      </span>
                      {isRefunded && purchase.refundedAt && (
                        <span className="text-xs font-medium text-red-400 italic ml-1">
                          Refund processed{" "}
                          {formatPurchaseDate(purchase.refundedAt)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white truncate">
                      {productDetails.name}
                    </h3>
                    <p className="text-sm text-[#c9c8ab] mt-1 max-w-2xl line-clamp-2">
                      {productDetails.description}
                    </p>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span
                      className={`text-lg font-bold ${
                        isRefunded
                          ? "text-[#929277] line-through"
                          : "text-brand-yellow"
                      }`}
                    >
                      {formatPrice(purchase.pricePaidInCents / 100, {
                        showZeroAsNumber: true,
                      })}
                    </span>
                    <p className="text-[11px] font-medium text-[#929277] mt-0.5">
                      ID: {purchase.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-5 border-t border-[#252524] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-[11px] font-medium text-[#929277] font-mono">
                    Session: {truncateSessionId(purchase.stripeSessionId)}
                  </span>
                  <div className="flex gap-2 flex-nowrap">
                    {isRefunded ? (
                      <button
                        disabled
                        className="px-5 py-2 border border-[#353534] text-[#929277] text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-not-allowed"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Invoice Void
                      </button>
                    ) : (
                      <>
                        <Link
                          href={`/products/${purchase.productId}`}
                          className="max-sm:w-1/2 max-sm:px-2 text-nowrap px-5 py-2 border border-[#353534] hover:bg-[#252524] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          View Receipt
                        </Link>
                        {firstCourseId && (
                          <Link
                            href={`/products/${purchase.productId}`}
                            className="max-sm:w-1/2 max-sm:px-2 text-nowrap px-5 py-2 bg-brand-yellow text-[#1b1d00] text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 active:scale-95 transition-all"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            Go to Product
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
