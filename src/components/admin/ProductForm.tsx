"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  FileText,
  Image as ImageIcon,
  CloudUpload,
  Link,
  DollarSign,
  Eye,
} from "lucide-react";

interface ProductFormProps {
  initialProduct?: Product | null;
}

export default function ProductForm({ initialProduct }: ProductFormProps) {
  const [name, setName] = useState(initialProduct ? initialProduct.name : "");
  const [description, setDescription] = useState(
    initialProduct ? initialProduct.description : "",
  );
  const [image, setImage] = useState(
    initialProduct ? initialProduct.image : "",
  );
  const [price, setPrice] = useState<number>(
    initialProduct ? initialProduct.price : 0,
  );
  const [status, setStatus] = useState<"Public" | "Private">(
    initialProduct ? initialProduct.status : "Public",
  );
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Auto populate placeholder image for local upload stimulation
    const mathSeed = Math.floor(Math.random() * 800);
    const mockPicUrl = `https://picsum.photos/seed/${mathSeed}/800/400`;
    setImage(mockPicUrl);
    alert(
      `File processed successfully. Cover graphic routed to cached buffer: ${mockPicUrl}`,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please specify a valid product name.");
      return;
    }

    // Handle generic image fallbacks
    const fallbackImage =
      image.trim() ||
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";

    console.log("Product submitted...");
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full space-y-8 pb-32">
      {/* Title block */}
      <section className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c9c8ab]">
          <span>Products</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[#e2ec00] font-mono font-medium">
            New Product
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">
          {initialProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="text-sm text-[#c9c8ab]">
          Configure details, pricing, and availability settings for your
          product.
        </p>
      </section>

      {/* Main compilation form block */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Product details */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#252525]/50">
            <FileText className="w-5 h-5 text-[#e2ec00]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Product Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="p_name"
                className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block"
              >
                Product Name
              </label>
              <input
                id="p_name"
                type="text"
                required
                placeholder="e.g. Neural Beat Matching Masterclass"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#131313] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-[#c9c8ab]/30 focus:outline-none focus:border-[#e2ec00] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="p_sku"
                className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block"
              >
                Attach Course(s)
              </label>
              <input
                id="p_courses"
                type="text"
                required
                placeholder="Check available courses for your product."
                // value={sku}
                // onChange={(e) => setSku(e.target.value)}
                className="w-full bg-[#131313] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e2ec00] transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="p_desc"
              className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block"
            >
              Description
            </label>
            <textarea
              id="p_desc"
              rows={4}
              placeholder="Describe the learning objectives and AI features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#131313] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-[#c9c8ab]/30 focus:outline-none focus:border-[#e2ec00] transition-all resize-none"
            />
          </div>
        </div>

        {/* Section 2: Visual elements (Drag-drop area metadata) */}
        {image && (
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={image}
              alt="Product Cover"
              className="w-full h-48 object-cover border border-[#252525] rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-2 right-2 bg-[#1a1a1a]/80 text-white text-xs px-2 py-1 rounded">
              Current Cover
            </span>
          </div>
        )}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#252525]/50">
            <ImageIcon className="w-5 h-5 text-[#e2ec00]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Product Cover
            </h3>
          </div>

          {/* Drap Drop Screen Container */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("p_image")?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-xl aspect-video bg-[#131313] flex flex-col items-center justify-center transition-all p-6 text-center ${
              dragActive
                ? "border-[#e2ec00] bg-[#e2ec00]/5 scale-[0.99] shadow-inner"
                : "border-[#252525] hover:border-[#e2ec00]/40"
            }`}
          >
            <input
              id="p_image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(URL.createObjectURL(e.target.files?.[0]!))
              }
              className="w-full h-full hidden"
            />
            <CloudUpload className="w-10 h-10 text-[#c9c8ab] mb-2" />
            <p className="text-xs font-semibold text-white">
              Tap to upload or drop image here
            </p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>

          {/* Custom URL Input block */}
          <div className="space-y-2">
            <label
              htmlFor="p_img"
              className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block"
            >
              Or Custom Image URL
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <Link className="w-4 h-4" />
              </span>
              <input
                id="p_img"
                type="url"
                placeholder="https://cloud.nudge.ai/v1/assets/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-[#131313] border border-[#252525] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-[#c9c8ab]/30 focus:outline-none focus:border-[#e2ec00] transition-all font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Config availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Price block */}
          <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#252525]/50">
              <span className="p-1 rounded bg-[#e2ec00]/10 text-[#e2ec00] shrink-0">
                <DollarSign className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pricing Configuration
              </h3>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="p_price"
                className="text-xs font-extrabold text-[#c9c8ab] uppercase tracking-widest block"
              >
                Unit Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#e2ec00] font-bold font-mono">
                  $
                </span>
                <input
                  id="p_price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price || ""}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#131313] border border-[#252525] rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#e2ec00] transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Box 2: Availability select */}
          <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#252525]/50">
              <span className="p-1 rounded bg-[#e2ec00]/10 text-[#e2ec00] shrink-0">
                <Eye className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Availability Status
              </h3>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="p_status"
                className="text-xs font-extrabold text-[#c9c8ab] uppercase tracking-widest block"
              >
                Visibility Status
              </label>
              <select
                id="p_status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "Public" | "Private")
                }
                className="w-full bg-[#131313] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-[#e2ec00] transition-all cursor-pointer"
              >
                <option value="Public">Public - Marketplace Listing</option>
                <option value="Private">Private - Sandbox/Cohort Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-[#252525]/40">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-[#e2ec00] text-[#1c1d00] hover:brightness-110 active:scale-95 text-xs font-bold rounded-xl shadow-[0_4px_16px_rgba(226,236,0,0.25)] transition-all uppercase tracking-wider"
          >
            {initialProduct ? "Apply Configuration" : "Create Product SKU"}
          </button>

          <button
            type="button"
            onClick={() =>
              console.log(
                "Cancel action triggered. Returning to product list...",
              )
            }
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#353534] text-[#c9c8ab] hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold transition-all uppercase"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
