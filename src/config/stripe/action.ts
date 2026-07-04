"use server";

import { headers } from "next/headers";
import { stripe } from ".";
import { getUserCoupon } from "@/lib/user-country-header";

export async function getClientSecret(
  product: {
    id: string;
    name: string;
    description: string;
    priceInDollars: number;
    imageUrl: string;
  },
  user: { id: string; email: string },
) {
  const origin = (await headers()).get("origin");
  const coupon = await getUserCoupon();
  const discounts = coupon ? [{ coupon: coupon.stripeCouponId }] : undefined;

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.imageUrl],
          },
          unit_amount: Math.round(product.priceInDollars * 100),
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,
    metadata: {
      productId: product.id,
      userId: user.id,
    },
    payment_intent_data: {
      receipt_email: user.email,
    },
    discounts,
    return_url: `${origin}/api/webhooks/stripe?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.client_secret) {
    throw new Error("Failed to create checkout session");
  }

  return session.client_secret;
}
