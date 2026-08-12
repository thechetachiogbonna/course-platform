import { db } from "@/database/db";
import ProductsPageClient from "@/components/user/ProductsPageClient";
import { userOwnsProduct } from "@/features/products/action";
import { getCurrentUser } from "@/features/users/action";
import { getUserCoupon } from "@/lib/user-country-header";

const getPublicProducts = async () => {
  const result = await db.query(`
    SELECT 
      p.*,
      COUNT(pch.id) as total_students
    FROM products as p
    LEFT JOIN purchases AS pch
      ON pch.product_id = p.id
    WHERE p.status = 'public' 
    GROUP BY p.id
    ORDER BY total_students DESC
  `);

  return result.rows.map((row) => ({
    ...row,
    imageUrl: row.image_url,
  }));
};

async function page() {
  const [products, { user }, coupon] = await Promise.all([
    getPublicProducts(),
    getCurrentUser(),
    getUserCoupon(),
  ]);

  const productsWithUserAccess = await Promise.all(
    products.map(async (p) => {
      if (!user) {
        return {
          ...p,
          hasPurchased: false,
        };
      }

      const hasPurchased = await userOwnsProduct(user.id, p.id);
      return {
        ...p,
        hasPurchased,
      };
    }),
  );

  return (
    <ProductsPageClient products={productsWithUserAccess} coupon={coupon} />
  );
}

export default page;
