import ProductCard from "@/components/user/ProductCard";
import { db } from "@/database/db";
import { userOwnsProduct } from "@/features/products/action";
import { getCurrentUser } from "@/features/users/action";
import { BookOpen, Search } from "lucide-react";

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
  const [products, user] = await Promise.all([
    getPublicProducts(),
    getCurrentUser(),
  ]);

  const productsWithUserAccess = await Promise.all(
    products.map(async (p) => {
      const hasPurchased = await userOwnsProduct(user.user.id, p.id);
      return {
        ...p,
        hasPurchased,
      };
    }),
  );

  return (
    <section className="w-full space-y-8 pb-16">
      <div className="space-y-5">
        <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white leading-tight">
          Master the <span className="text-brand-yellow">Future</span>
        </h1>
        <div className="relative group max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 group-focus-within:text-brand-yellow transition-colors" />
          <input
            type="text"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#181818] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs md:text-sm text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300 placeholder:text-on-surface-variant/30"
          />
        </div>
      </div>

      {/* Grid course list */}
      <div>
        <h2 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-4">
          AVAILABLE PRODUCTS
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {productsWithUserAccess.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#181818] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3">
            <BookOpen className="w-12 h-12 text-on-surface-variant" />
            <p className="text-sm font-bold text-white">
              No available catalog courses found.
            </p>
            <p className="text-xs text-on-surface-variant max-w-md">
              Try searching for other terms or check your purchases list to
              resume active sessions.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default page;
