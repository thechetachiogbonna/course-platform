import React, { useState } from "react";
import {
  ChevronRight,
  Edit3,
  PlusCircle,
  Compass,
  Sparkles,
  ChevronDown,
  Book,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";

interface SectionFormProps {
  course: Course | null;
  onSubmit: (sectionData: {
    name: string;
    status: "public" | "private";
    order: number;
  }) => void;
  onCancel: () => void;
}

export default function SectionForm({
  course,
  onSubmit,
  onCancel,
}: SectionFormProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"public" | "private">("public");
  const [order, setOrder] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, status, order });
  };

  const courseTitle = course
    ? course.name
    : "Advanced Neural Architectures 101";

  return (
    <Dialog>
      <DialogTrigger>Add Section</DialogTrigger>
      <DialogContent className="bg-inherit">
        <div className="flex-1 max-w-xl mx-auto w-full space-y-8 pb-16">
          {/* breadcrumb header */}
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">
              Add New Section
            </h2>

            {/* Highlight Course Detail Banner */}
            <div className="flex items-center gap-3 bg-[#1c1b1b] border border-[#252525] p-4 rounded-2xl">
              <div className="w-12 h-12 bg-[#e2ec00]/10 border border-[#e2ec00]/20 rounded-xl flex items-center justify-center text-[#e2ec00] shrink-0">
                {/* <Compass className="w-6 h-6" /> */}
                <Book />
              </div>
              <div>
                <p className="text-[10px] text-[#c9c8ab] font-bold uppercase tracking-widest">
                  ADDING TO COURSE
                </p>
                <p className="text-sm font-extrabold text-white">
                  {courseTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Main Glass Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#252525] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden"
          >
            {/* Top styling strip */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-[#e2ec00] to-transparent opacity-40"></div>

            {/* Input: Section Name */}
            <div className="space-y-2">
              <label
                className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block"
                htmlFor="section_name"
              >
                Section Name
              </label>
              <div className="relative">
                <input
                  id="section_name"
                  type="text"
                  required
                  placeholder="e.g. Introduction to Transformers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131313] border border-[#252525] rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-[#c9c8ab]/30 focus:outline-none focus:border-[#e2ec00] transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Edit3 className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Row Form Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status SELECT */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block"
                  htmlFor="publication_status"
                >
                  Publication Status
                </label>
                <div className="relative">
                  <select
                    id="publication_status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "public" | "private")
                    }
                    className="w-full bg-[#131313] border border-[#252525] rounded-xl px-4 py-3.5 text-sm text-white appearance-none focus:outline-none focus:border-[#e2ec00] transition-all cursor-pointer"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private (Draft)</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Input: Order */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block"
                  htmlFor="display_order"
                >
                  Display Order
                </label>
                <input
                  id="display_order"
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#131313] border border-[#252525] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#e2ec00] transition-all"
                />
              </div>
            </div>

            {/* Form Actions footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#e2ec00] text-[#1c1d00] hover:brightness-110 active:scale-95 transition-all py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(226,236,0,0.15)]"
              >
                <PlusCircle className="w-4 h-4" />
                Add Section
              </button>

              <DialogClose asChild>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-transparent border border-[#353534] text-[#c9c8ab] hover:text-white hover:bg-white/5 transition-all py-3.5 rounded-xl text-xs font-bold uppercase"
                >
                  Cancel
                </button>
              </DialogClose>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
