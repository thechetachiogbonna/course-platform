import { db } from "@/database/db";
import ProductsPageClient from "@/components/admin/ProductsPageClient";

const getAllProducts = async () => {
  const result = await db.query(`
    SELECT
      p.*,
      coalesce(
        jsonb_agg(to_jsonb(c) ORDER BY c.name),
        '[]'::jsonb
      ) AS courses
    FROM products AS p
    LEFT JOIN course_products AS cp
      ON p.id = cp.product_id
    LEFT JOIN courses AS c
      ON cp.course_id = c.id
    GROUP BY p.id
    ORDER BY p.name
  `);
  return result.rows;
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return <ProductsPageClient products={products} />;
}
