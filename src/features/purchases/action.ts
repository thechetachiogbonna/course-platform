"use server";

import { PoolClient } from "pg";

export const insertPurchase = async ({
  userId,
  productId,
  amount,
  productDetails,
  stripeSessionId,
}: {
  userId: string;
  productId: string;
  amount: number;
  productDetails: Omit<Product, "courses">;
  stripeSessionId: string;
}, trx: PoolClient) => {
  try {
    const result = await trx.query(
      "INSERT INTO purchases (user_id, product_id, price_paid_in_cents, product_details, stripe_session_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (stripe_session_id) DO NOTHING RETURNING *",
      [userId, productId, amount, JSON.stringify(productDetails), stripeSessionId],
    );

    return {
      error: false,
      message: "Purchase inserted successfully",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error inserting purchase:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to insert purchase",
    };
  }
};