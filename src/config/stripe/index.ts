import "server-only";

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY)
  throw new Error(
    "Stripe keys not configured. Please set STRIPE_SECRET_KEY in env file.",
  );

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
