"use client";

import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew = true;

  return (
    <Link href={`/products/${product.id}`} className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:border-brand-yellow/50 hover:electric-glow transition-all duration-300 cursor-pointer">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {isNew && (
          <div className="absolute top-4 right-4 bg-surface-container-highest/90 backdrop-blur-md text-white font-semibold text-[10px] tracking-wider uppercase px-2-5 py-1 rounded border border-white/10 shadow-md">
            NEW
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col grow justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1 bg-white/5 w-fit px-2 py-0.5 rounded-full border border-white/5">
            <span className="text-[10px] text-on-surface-variant">
              {/* (
              {product.studentsCount >= 1000
                ? `${(product.studentsCount / 1000).toFixed(1)}k`
                : product.studentsCount}{" "}
              students) */}
              2k
            </span>
          </div>

          <h3 className="font-display font-bold text-lg text-white mb-1.5 leading-tight group-hover:text-brand-yellow transition-colors duration-200">
            {product.name}
          </h3>

          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 font-sans leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Action Bottom row */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="font-display font-bold text-lg text-brand-yellow">
            ${product.price.toFixed(2)}
          </span>
          <button
            className="bg-brand-yellow hover:bg-[#c6cf00] active:scale-95 text-black px-4 py-2 rounded-lg font-bold text-xs tracking-wide uppercase transition-all shadow-md"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </Link>
  );
}
