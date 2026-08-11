"use client";

import { Plus, Edit3, Layers, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import SearchInput from "@/components/SearchInput";
import DeleteActionButton from "@/components/ui/DeleteActionButton";
import { deleteProduct } from "@/features/products/action";

interface Product {
  id: string;
  name: string;
  description: string | null;
  status: string;
  price: number;
  image_url: string | null;
}

interface ProductsPageClientProps {
  products: Product[];
}

export default function ProductsPageClient({
  products,
}: ProductsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [productList, setProductList] = useState(products);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return productList;
    }

    return productList.filter((product) => {
      const haystack = [
        product.name,
        product.description ?? "",
        product.status ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [productList, searchQuery]);

  const totalProducts = productList.length;
  const publicListings = productList.filter(
    (product) => product.status === "public",
  ).length;
  const privateListings = productList.filter(
    (product) => product.status === "private",
  ).length;

  return (
    <div className="flex-1 w-full space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Products
          </h1>
          <p className="text-sm text-[#c9c8ab]">
            View, create, update, delete, and manage products.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-brand-yellow/30 transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <Layers className="w-24 h-24" />
          </div>
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Total Products
          </span>
          <p className="text-4xl font-extrabold text-white">{totalProducts}</p>
        </div>

        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative group hover:border-brand-yellow/30 transition-all">
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Public Listings
          </span>
          <p className="text-4xl font-extrabold text-brand-yellow">
            {publicListings}
          </p>
        </div>

        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative group hover:border-brand-yellow/30 transition-all">
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Private Listings
          </span>
          <p className="text-4xl font-extrabold text-white">
            {privateListings}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#141414] p-3 rounded-2xl border border-[#252525]">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search product name or description..."
          className="w-full lg:max-w-md"
        />

        <div className="flex gap-2 w-full lg:w-auto shrink-0 justify-end">
          <Link
            href="/admin/products/new"
            className="bg-brand-yellow text-[#1c1d00] hover:brightness-110 active:scale-95 transition-all px-5 py-3 rounded-xl font-bold text-xs tracking-wider flex items-center gap-1 shadow-[0_4px_12px_rgba(226,236,0,0.15)] uppercase"
          >
            <Plus className="w-4 h-4" />
            New Product
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#1a1a1a]/40 border border-[#252525] rounded-2xl">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-bold text-white mb-1">
            {searchQuery
              ? "No products match your search"
              : "No products found"}
          </h3>
          <p className="text-sm text-[#c9c8ab] max-w-sm mx-auto">
            Try refining your search text to find the right product.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isPublic = product.status === "Public";
            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] rounded-2xl overflow-hidden flex flex-col hover:border-brand-yellow/40 group transition-all duration-300"
              >
                <div className="h-48 w-full overflow-hidden relative bg-[#2a2a2a]">
                  <img
                    alt={product.name}
                    src={product.image_url ?? ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute top-3 right-3 bg-[#131313]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                    <span
                      className={`w-2 h-2 rounded-full ${isPublic ? "bg-brand-yellow shadow-[0_0_8px_rgba(226,236,0,0.8)]" : "bg-[#c9c8ab]/40"}`}
                    />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {product.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-base text-white tracking-tight line-clamp-1 group-hover:text-brand-yellow transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-sm font-extrabold text-brand-yellow whitespace-nowrap">
                      $
                      {Number(product.price || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#c9c8ab] line-clamp-3 mb-6 flex-1 lead-relaxed">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="py-2.5 rounded-xl border border-[#353534] hover:bg-[#252524] hover:border-[#c9c8ab]/30 transition-all text-xs font-bold text-[#c8c6c5] flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <DeleteActionButton
                      onDelete={async () => {
                        const result = await deleteProduct(product.id);
                        if (!result.error) {
                          setProductList((current) =>
                            current.filter((item) => item.id !== product.id),
                          );
                        }
                        return result;
                      }}
                      itemName={product.name}
                      title="Delete product"
                      description={`This action cannot be undone. This will permanently delete "${product.name}" and its related product details.`}
                      errorMessage="Failed to delete product"
                      className="py-2.5 rounded-xl border border-[#353534] hover:bg-[#581d1d] hover:border-[#c9c8ab]/30 transition-all text-xs font-bold text-[#c8c6c5] flex items-center justify-center gap-1.5"
                      iconClassName="w-3.5 h-3.5"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
