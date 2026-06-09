import {
  Plus,
  Search,
  Edit3,
  Layers,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import { db } from "@/database/db";

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
  `)
  return result.rows
}

export default async function ProductsPage() {
  const products = await getAllProducts();
  console.log(products)
  // const [searchQuery, setSearchQuery] = useState("");
  // const [filterStatus, setFilterStatus] = useState<
  //   "All" | "Public" | "Private"
  // >("All");
  // const [selectedProductForAnalytics, setSelectedProductForAnalytics] =
  //   useState<Product | null>(null);

  // // Filter products based on search and status filter
  // const filteredProducts = useMemo(() => {
  //   return products.filter((p) => {
  //     const matchesSearch =
  //       p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       p.description.toLowerCase().includes(searchQuery.toLowerCase());

  //     const matchesFilter =
  //       filterStatus === "All" ? true : p.status === filterStatus;

  //     return matchesSearch && matchesFilter;
  //   });
  // }, [products, searchQuery, filterStatus]);

  // // Compute stats based on the products dynamically
  // const stats = useMemo(() => {
  //   const baseSkus = 120 + products.length;
  //   const basePublic =
  //     80 + products.filter((p) => p.status === "Public").length;

  //   // Sum prices
  //   const sumPrices = products.reduce((total, p) => total + p.price, 0);
  //   const formattedValue = `$${((412500 + sumPrices) / 1000).toFixed(1)}k`;

  //   return {
  //     skus: baseSkus,
  //     publicListings: basePublic,
  //     value: formattedValue,
  //   };
  // }, [products]);

  return (
    <div className="flex-1 w-full space-y-8 pb-16">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Inventory <span className="text-[#e2ec00] font-mono">Catalog</span>
          </h1>
          <p className="text-sm text-[#c9c8ab]">
            Monitor, deploy, and configure technical learning devices.
          </p>
        </div>
      </div>

      {/* Stats Bento Grid Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total SKUs */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#e2ec00]/30 transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <Layers className="w-24 h-24" />
          </div>
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Total SKUs
          </span>
          <p className="text-4xl font-extrabold text-white">{124}</p>
        </div>

        {/* Card 2: Public Listings */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative group hover:border-[#e2ec00]/30 transition-all">
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Public Listings
          </span>
          <p className="text-4xl font-extrabold text-[#e2ec00]">
            {40}
          </p>
        </div>

        {/* Card 3: Inventory Value */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-5 rounded-2xl flex flex-col justify-between h-32 relative group hover:border-[#e2ec00]/30 transition-all">
          <span className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
            Inventory Value
          </span>
          <p className="text-4xl font-extrabold text-white">{453}</p>
        </div>
      </div>

      {/* Filters & Actions Sub-bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#141414] p-3 rounded-2xl border border-[#252525]">
        <div className="relative w-full lg:max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9c8ab]">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search product name or description..."
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-[#c9c8ab]/40 focus:outline-none focus:border-[#e2ec00] transition-all"
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto shrink-0 justify-end">
          {/* Filter Dropdown Status */}
          {/* <div className="flex items-center bg-[#1a1a1a] rounded-xl border border-[#252525] p-1">
            <button
              onClick={() => setFilterStatus("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === "All"
                  ? "bg-[#2a2a29] text-white"
                  : "text-[#c9c8ab] hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("Public")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === "Public"
                  ? "bg-[#e2ec00] text-[#1c1d00]"
                  : "text-[#c9c8ab] hover:text-white"
              }`}
            >
              Public
            </button>
            <button
              onClick={() => setFilterStatus("Private")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === "Private"
                  ? "bg-[#2a2a29] text-white"
                  : "text-[#c9c8ab] hover:text-white"
              }`}
            >
              Private
            </button>
          </div> */}

          <Link
            href="/admin/products/new"
            className="bg-[#e2ec00] text-[#1c1d00] hover:brightness-110 active:scale-95 transition-all px-5 py-3 rounded-xl font-bold text-xs tracking-wider flex items-center gap-1 shadow-[0_4px_12px_rgba(226,236,0,0.15)] uppercase"
          >
            <Plus className="w-4 h-4" />
            New Product
          </Link>
        </div>
      </div>

      {/* Catalog items render */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-[#1a1a1a]/40 border border-[#252525] rounded-2xl">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-bold text-white mb-1">
            No matching hardware matches criteria
          </h3>
          <p className="text-sm text-[#c9c8ab] max-w-sm mx-auto">
            Try refining your search text or shifting visibility statuses above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => {
            const isPublic = p.status === "Public";
            return (
              <div
                key={p.id}
                id={`product-card-${p.id}`}
                className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] rounded-2xl overflow-hidden flex flex-col hover:border-[#e2ec00]/40 group transition-all duration-300"
              >
                {/* Cover Image Container */}
                <div className="h-48 w-full overflow-hidden relative bg-[#2a2a2a]">
                  <img
                    alt={p.name}
                    src={p.image_url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 bg-[#131313]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                    <span
                      className={`w-2 h-2 rounded-full ${isPublic ? "bg-[#e2ec00] shadow-[0_0_8px_rgba(226,236,0,0.8)]" : "bg-[#c9c8ab]/40"}`}
                    />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-base text-white tracking-tight line-clamp-1 group-hover:text-[#e2ec00] transition-colors">
                      {p.name}
                    </h3>
                    <span className="text-sm font-extrabold text-[#e2ec00] whitespace-nowrap">
                      $
                      {p.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#c9c8ab] line-clamp-3 mb-6 flex-1 lead-relaxed">
                    {p.description}
                  </p>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="py-2.5 rounded-xl border border-[#353534] hover:bg-[#252524] hover:border-[#c9c8ab]/30 transition-all text-xs font-bold text-[#c8c6c5] flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        id="inventory-fab"
        // onClick={onAddProductClick}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-[#e2ec00] hover:scale-110 active:scale-95 transition-all shadow-[0_8px_32px_rgba(226,236,0,0.35)] rounded-full flex items-center justify-center z-40 group focus:outline-none"
      >
        <Plus className="w-7 h-7 text-[#1c1d00]" />

        {/* Tooltip on hover */}
        <span className="absolute right-16 bg-[#1e1e1d] border border-[#2d2d2c] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 shadow-xl transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-wider">
          Add New SKU
        </span>
      </button>
    </div>
  );
}
