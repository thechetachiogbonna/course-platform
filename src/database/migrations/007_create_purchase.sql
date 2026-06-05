CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  price_paid_in_cents INT NOT NULL,
  product_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  stripe_session_id TEXT NOT NULL UNIQUE,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_purchase_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_purchase_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);