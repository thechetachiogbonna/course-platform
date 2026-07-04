import { stripe } from "@/config/stripe";
import { db } from "@/database/db";
import { addUserCourseAccess } from "@/features/courses/action";
import { insertPurchase } from "@/features/purchases/action";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    let event;

    const signature = req.headers.get("stripe-signature");

    if (!signature) return new Response("Missing signature", { status: 400 });

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return new Response("Missing webhook secret", { status: 400 });
    }

    try {
      const body = await req.text();
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Unknown error occurred";
      return new Response(`Webhook Error: ${errMsg}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        const session = event.data.object;

        await processStripeCheckout(session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

const processStripeCheckout = async (
  checkoutSession: Stripe.Checkout.Session,
) => {
  if (typeof checkoutSession.metadata?.userId !== "string") {
    throw new Error("Error: Please try again later!");
  }

  if (typeof checkoutSession.metadata?.productId !== "string") {
    throw new Error("Error: Please try again later!");
  }

  const client = await db.connect();

  try {
    const product = await getProduct(checkoutSession.metadata.productId);

    if (!product) {
      throw new Error("Product not found");
    }
      
    const courseIds = product.map((item) => item.course_id);
      
    try {
      await client.query("BEGIN");
      await addUserCourseAccess({ userId: checkoutSession.metadata.userId, courseIds }, client);
      await insertPurchase({
        userId: checkoutSession.metadata.userId,
        productId: checkoutSession.metadata.productId,
        amount: checkoutSession.amount_total!,
        productDetails: {
          id: product[0].id,
          name: product[0].name,
          description: product[0].description,
          imageUrl: product[0].imageUrl,
          price: product[0].price,
          status: product[0].status,
          created_at: product[0].created_at
        },
        stripeSessionId: checkoutSession.id,
      }, client)
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error processing Stripe checkout:", error);
    throw error;
  } finally {
    client.release();
  }
};

const getProduct = async (productId: string) => {
  const result = await db.query(
    `
      SELECT 
        p.*,
        cp.*
      FROM products p
      LEFT JOIN course_products cp 
        ON p.id = cp.product_id
      WHERE p.id = $1 AND p.status = 'public'
    `,
    [productId],
  );
  return result.rows.map((item) => {
    return {
      ...item,
      imageUrl: item.image_url as string,
    }
  }) as (Product & { course_id: string })[];
};
