"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductWithAccess {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  imageUrl?: string | null;
  status: string;
  price: number;
  total_students: number;
  hasPurchased: boolean;
}

interface PublicProductsClientProps {
  products: ProductWithAccess[];
  coupon: Coupon;
}

export default function ProductsPageClient({
  products,
  coupon,
}: PublicProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const haystack = [product.name, product.description ?? ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [products, searchQuery]);

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
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#181818] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs md:text-sm text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300 placeholder:text-on-surface-variant/30"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-4">
          AVAILABLE PRODUCTS
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product as never}
                coupon={coupon}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#181818] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3">
            <BookOpen className="w-12 h-12 text-on-surface-variant" />
            <p className="text-sm font-bold text-white">
              {searchQuery
                ? "No products match your search"
                : "No available catalog courses found."}
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
