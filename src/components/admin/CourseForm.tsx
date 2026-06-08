import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Search,
  Lightbulb,
  ExternalLink,
  Check,
} from "lucide-react";

interface NewCourseFormProps {
  products: Product[];
  onSubmit: (courseData: {
    name: string;
    description: string;
    productId: string;
  }) => void;
  onCancel: () => void;
}

export const NewCourseForm: React.FC<NewCourseFormProps> = ({
  products,
  onSubmit,
  onCancel,
}) => {
  const [courseName, setCourseName] = useState("");
  const [skuSearch, setSkuSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [description, setDescription] = useState("");
  const [showSkuDropdown, setShowSkuDropdown] = useState(false);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!skuSearch) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(skuSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(skuSearch.toLowerCase()),
    );
  }, [products, skuSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      alert("Please enter a course name.");
      return;
    }

    const linkedSku =
      selectedProductId ||
      (products.length > 0 ? products[0].sku : "NUDGE-001");

    onSubmit({
      name: courseName,
      description,
      productId: linkedSku,
    });
  };

  return (
    <div className="flex-1 max-w-xl mx-auto w-full space-y-8 pb-16">
      {/* Header Mimicking the Image's top bar */}
      <div className="flex items-center justify-between border-b border-[#252525]/30 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="hover:bg-white/5 p-2 rounded-full transition-all text-white"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#e2ec00]" />
          </button>
          <span className="font-extrabold text-sm uppercase tracking-wider text-white">
            New Course
          </span>
        </div>
        <button
          type="button"
          className="hover:bg-white/5 p-2 rounded-full transition-all text-gray-400"
          onClick={() => alert("Curriculum guidelines options.")}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Main Headline Block */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">
          Create Course
        </h2>
        <p className="text-sm text-gray-400">
          Define the core curriculum details for your new learning path.
        </p>
      </div>

      {/* Main glass form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Name Input */}
        <div className="space-y-2">
          <label
            htmlFor="course_name_input"
            className="text-xs font-bold text-[#e2ec00] uppercase tracking-wider block"
          >
            Course Name
          </label>
          <input
            id="course_name_input"
            type="text"
            required
            placeholder="e.g. Master Class: Prompt Engineering"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full bg-[#131313] border border-[#252525] rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e2ec00] transition-all"
          />
        </div>

        {/* Product Link Search Input */}
        <div className="space-y-2 relative">
          <label
            htmlFor="product_link_input"
            className="text-xs font-bold text-[#e2ec00] uppercase tracking-wider block"
          >
            Product Link
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="product_link_input"
              type="text"
              placeholder="Search linked product SKU..."
              value={skuSearch}
              onChange={(e) => {
                setSkuSearch(e.target.value);
                setShowSkuDropdown(true);
              }}
              onFocus={() => setShowSkuDropdown(true)}
              className="w-full bg-[#131313] border border-[#252525] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e2ec00] transition-all"
            />
          </div>
          <p className="text-[11px] text-gray-500 italic mt-1">
            Associate this course with a billing entity.
          </p>

          {/* Interactive SKU dropdown */}
          {showSkuDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#131313] border border-[#252525] rounded-xl z-50 max-h-48 overflow-y-auto shadow-2xl divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-xs text-gray-500 italic">
                  No matching hardware SKUs found
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const isSelected = selectedProductId === p.sku;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProductId(p.sku);
                        setSkuSearch(p.sku);
                        setShowSkuDropdown(false);
                      }}
                      className="w-full text-left p-3 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {p.sku} — ${p.price}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#e2ec00]" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Description TextArea */}
        <div className="space-y-2">
          <label
            htmlFor="course_description_input"
            className="text-xs font-bold text-[#e2ec00] uppercase tracking-wider block"
          >
            Description
          </label>
          <textarea
            id="course_description_input"
            rows={5}
            placeholder="Describe the learning outcomes and target audience..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#131313] border border-[#252525] rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e2ec00] transition-all resize-none"
          />
        </div>

        {/* Action button triggers */}
        <div className="space-y-3 pt-4">
          <button
            type="submit"
            className="w-full bg-[#e2ec00] text-[#1c1d00] hover:brightness-110 active:scale-95 transition-all py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center shadow-[0_4px_12px_rgba(226,236,0,0.15)] uppercase tracking-wider"
          >
            Create Course
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-transparent border border-[#252525] hover:bg-white/5 text-gray-300 hover:text-white transition-all py-3.5 rounded-xl text-sm font-bold text-center uppercase tracking-wider"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Suggestion Pro Tip section */}
      <div className="p-5 rounded-2xl bg-[#1a1a19] border border-[#252524] flex gap-4 items-start relative overflow-hidden">
        <div className="p-2.5 rounded-xl bg-[#e2ec00]/10 border border-[#e2ec00]/20 text-[#e2ec00] shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-[#e2ec00] uppercase font-mono tracking-wider">
            Nudge AI Pro Tip
          </h4>
          <p className="text-gray-400 leading-relaxed font-sans mt-1">
            Course naming directly affects your SEO visibility. Use strong,
            action-oriented verbs and include high-intent keywords like
            "Mastery," "Architecture," or "Production" to increase internal
            search relevance by up to 40%.
          </p>
          <button
            type="button"
            onClick={() =>
              alert("Displaying course registry documentation... Success.")
            }
            className="text-[#e2ec00] hover:underline font-mono text-[10px] mt-2 inline-flex items-center gap-1 font-bold"
          >
            Learn More
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
