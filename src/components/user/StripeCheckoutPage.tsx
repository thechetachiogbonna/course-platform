"use client";

import { getClientSecret } from "@/config/stripe/action";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type StripeCheckoutProps = {
  product: {
    id: string;
    name: string;
    description: string;
    priceInDollars: number;
    imageUrl: string;
  };
  user: {
    id: string;
    email: string;
  };
};

export default function StripeCheckout({ product, user }: StripeCheckoutProps) {
  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: () => getClientSecret(product, user) }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  ); 
}
