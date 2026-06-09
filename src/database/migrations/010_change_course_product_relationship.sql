ALTER TABLE products
DROP CONSTRAINT IF EXISTS fk_course_product;

ALTER TABLE products
DROP COLUMN IF EXISTS course_id;

ALTER TABLE courses
DROP CONSTRAINT IF EXISTS fk_product_course;

ALTER TABLE courses
DROP COLUMN IF EXISTS product_id;

CREATE TABLE IF NOT EXISTS course_products (
  course_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (course_id, product_id),
  CONSTRAINT fk_course_product
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_course
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);