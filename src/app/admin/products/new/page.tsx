import ProductForm from "@/components/admin/ProductForm";
import { db } from "@/database/db";

const getAvailableCourse = async () => {
  const result = await db.query(`
    SELECT
      *
    FROM courses
    ORDER BY updated_at DESC
  `);

  return result.rows;
};

export default async function NewProductPage() {
  const courses = await getAvailableCourse();
  return <ProductForm type="create" courses={courses} />;
}
