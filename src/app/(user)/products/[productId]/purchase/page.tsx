import StripeCheckout from "@/components/user/StripeCheckoutPage";
import { db } from "@/database/db";
import { userOwnsProduct } from "@/features/products/action";
import { getCurrentUser } from "@/features/users/action";
import { notFound, redirect } from "next/navigation";

const getPublicProduct = async (productId: string) => {
  const result = await db.query(
    `
      SELECT * FROM products WHERE id = $1 AND status = 'public'
    `,
    [productId],
  );

  if (!result.rows[0]) return null;

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    description: result.rows[0].description,
    priceInDollars: result.rows[0].price,
    imageUrl: result.rows[0].image_url,
  };
};

export default async function PurchasePage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const { user } = await getCurrentUser();

  const product = await getPublicProduct(productId);

  if (!product) return notFound();

  if (!user) redirect(`/sign-in?redirect_url=/products/${productId}/purchase`);

  const ownsProduct = await userOwnsProduct(user.id, productId);

  if (ownsProduct) {
    return redirect("/");
  }

  return <StripeCheckout product={product} user={user} />;
}
