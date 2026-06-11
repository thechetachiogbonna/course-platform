import ProductForm from "@/components/admin/ProductForm";
import { db } from "@/database/db";

const getProductById = async (id: string) => {
  const result = await db.query(`
    SELECT
      p.*,
      p.image_url AS "imageUrl"
      ,coalesce(
        jsonb_agg(to_jsonb(c) order by c.name),
        '[]'::jsonb
      ) AS courses
    FROM products AS p
    LEFT JOIN course_products AS cp
      ON p.id = cp.product_id
    LEFT JOIN courses AS c
      ON cp.course_id = c.id
    WHERE p.id = $1
    GROUP BY p.id
   `, 
    [id]
  );

  return result.rows[0];
};

const getAvailableCourse = async () => {
  const result = await db.query(`
    SELECT
      *
    FROM courses
    ORDER BY updated_at DESC
  `);

  return result.rows;
};

async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const [product, availableCourses] = await Promise.all([
    getProductById(productId),
    getAvailableCourse(),
  ]);

  return <ProductForm type="edit" selectedCourses={product.courses} initialProduct={product} courses={availableCourses} />;
}

export default EditProductPage;
