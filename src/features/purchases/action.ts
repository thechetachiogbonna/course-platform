"use server";

import { PoolClient } from "pg";
import { db } from "@/database/db";
import { stripe } from "@/config/stripe";

export const insertPurchase = async (
  {
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
  },
  trx: PoolClient,
) => {
  try {
    const result = await trx.query(
      "INSERT INTO purchases (user_id, product_id, price_paid_in_cents, product_details, stripe_session_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (stripe_session_id) DO NOTHING RETURNING *",
      [
        userId,
        productId,
        amount,
        JSON.stringify(productDetails),
        stripeSessionId,
      ],
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

export const getSalesMetrics = async () => {
  try {
    // Total revenue (excluding refunded items)
    const revenueResult = await db.query(`
      SELECT COALESCE(SUM(price_paid_in_cents) / 100.0, 0) as total_revenue
      FROM purchases
      WHERE refunded_at IS NULL
    `);

    // Total sales (number of successful checkouts)
    const salesResult = await db.query(`
      SELECT COUNT(*) as total_sales
      FROM purchases
      WHERE refunded_at IS NULL
    `);

    // Active users / students (distinct users with at least one active purchase)
    const usersResult = await db.query(`
      SELECT COUNT(DISTINCT user_id) as active_users
      FROM purchases
      WHERE refunded_at IS NULL
    `);

    // Refund rate (refunded transactions / total transactions)
    const refundRateResult = await db.query(`
      SELECT
        COUNT(CASE WHEN refunded_at IS NOT NULL THEN 1 END) as refunded_count,
        COUNT(*) as total_count
      FROM purchases
    `);

    // Last month revenue comparison
    const lastMonthResult = await db.query(`
      SELECT
        COALESCE(SUM(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN price_paid_in_cents END) / 100.0, 0) as current_month_revenue,
        COALESCE(SUM(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN price_paid_in_cents END) / 100.0, 0) as last_month_revenue
      FROM purchases
      WHERE refunded_at IS NULL
    `);

    const totalRevenue = parseFloat(revenueResult.rows[0]?.total_revenue || 0);
    const totalSales = parseInt(salesResult.rows[0]?.total_sales || 0);
    const activeUsers = parseInt(usersResult.rows[0]?.active_users || 0);
    const refundedCount = parseInt(
      refundRateResult.rows[0]?.refunded_count || 0,
    );
    const totalCount = parseInt(refundRateResult.rows[0]?.total_count || 0);
    const currentMonthRevenue = parseFloat(
      lastMonthResult.rows[0]?.current_month_revenue || 0,
    );
    const lastMonthRevenue = parseFloat(
      lastMonthResult.rows[0]?.last_month_revenue || 0,
    );

    const refundRate = totalCount > 0 ? (refundedCount / totalCount) * 100 : 0;
    const monthlyGrowth =
      lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    return {
      totalRevenue,
      totalSales,
      activeUsers,
      refundRate,
      monthlyGrowth,
      currentMonthRevenue,
      lastMonthRevenue,
    };
  } catch (error) {
    console.error("Error fetching sales metrics:", error);
    throw error;
  }
};

export const getRevenueByProduct = async () => {
  try {
    const result = await db.query(`
      SELECT
        p.id,
        p.name,
        COUNT(pu.id) as sales_count,
        COALESCE(SUM(CASE WHEN pu.refunded_at IS NULL THEN pu.price_paid_in_cents ELSE 0 END) / 100.0, 0) as total_revenue
      FROM products p
      LEFT JOIN purchases pu ON p.id = pu.product_id
      GROUP BY p.id, p.name
      ORDER BY total_revenue DESC
    `);
    return result.rows.map((row: any) => ({
      ...row,
      total_revenue: parseFloat(row.total_revenue),
      sales_count: parseInt(row.sales_count),
    }));
  } catch (error) {
    console.error("Error fetching revenue by product:", error);
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const result = await db.query(`
      SELECT
        pu.id,
        pu.created_at,
        pu.stripe_session_id,
        pu.price_paid_in_cents,
        pu.refunded_at,
        u.name as customer_name,
        u.email as customer_email,
        p.name as product_name,
        p.id as product_id
      FROM purchases pu
      JOIN users u ON pu.user_id = u.id
      JOIN products p ON pu.product_id = p.id
      ORDER BY pu.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const refundPurchase = async (purchaseId: string) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Get purchase details
    const purchaseResult = await client.query(
      "SELECT * FROM purchases WHERE id = $1",
      [purchaseId],
    );

    if (purchaseResult.rows.length === 0) {
      throw new Error("Purchase not found");
    }

    const purchase = purchaseResult.rows[0];

    try {
      const session = await stripe.checkout.sessions.retrieve(
        purchase.stripe_session_id,
      );
      if (session.payment_intent) {
        await stripe.refunds.create({
          payment_intent: session.payment_intent as string,
        });
      }
    } catch (stripeError) {
      console.warn(
        "Stripe refund failed, proceeding with database refund:",
        stripeError,
      );
    }

    // Update purchase with refund timestamp
    await client.query(
      "UPDATE purchases SET refunded_at = NOW(), updated_at = NOW() WHERE id = $1",
      [purchaseId],
    );

    // Get all courses associated with the product
    const coursesResult = await client.query(
      `
      SELECT c.id
      FROM courses c
      JOIN course_products cp ON c.id = cp.course_id
      WHERE cp.product_id = $1
    `,
      [purchase.product_id],
    );

    // Revoke user access to courses only if they have no other active purchases for products linking to those courses
    for (const course of coursesResult.rows) {
      // Check if user has other active purchases for products linked to this course
      const otherPurchasesResult = await client.query(
        `
        SELECT COUNT(*) as count
        FROM purchases pu
        JOIN course_products cp ON pu.product_id = cp.product_id
        WHERE pu.user_id = $1
        AND cp.course_id = $2
        AND pu.refunded_at IS NULL
        AND pu.id != $3
      `,
        [purchase.user_id, course.id, purchaseId],
      );

      const hasOtherPurchases =
        parseInt(otherPurchasesResult.rows[0]?.count || 0) > 0;

      if (!hasOtherPurchases) {
        await client.query(
          "DELETE FROM user_course_access WHERE user_id = $1 AND course_id = $2",
          [purchase.user_id, course.id],
        );
      }
    }

    await client.query("COMMIT");

    return {
      error: false,
      message: "Purchase refunded successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error refunding purchase:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to refund purchase",
    };
  } finally {
    client.release();
  }
};
