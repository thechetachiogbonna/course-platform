import React, { ReactNode, useState } from "react";
import { FolderOpen, Link, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LessonFormProps {
  sectionName: string;
  onSubmit: (lessonData: {
    name: string;
    description: string;
    videoId: string;
    status: "public" | "private" | "preview";
    order: number;
  }) => void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function LessonForm({
  sectionName,
  onSubmit,
  onCancel,
  children,
}: LessonFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoId, setVideoId] = useState("");
  const [status, setStatus] = useState<"public" | "private" | "preview">(
    "preview",
  );
  const [order, setOrder] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name,
      description: description.trim() || "Introductory lesson tutorial module.",
      videoId: videoId.trim() || "dQw4w9WgXcQ", // standard rickroll placeholder
      status,
      order,
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full flex items-start">
        {children ?? "Add Lesson"}
      </DialogTrigger>
      <DialogContent className="bg-inherit">
        <div className=" flex-1 w-full space-y-8">
          {/* Title block */}
          <section className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
              New Lesson
            </h1>

            {/* Adds Section Title Context Highlight Pill (Screen 5) */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#201f1f] border border-white/5 shadow-inner">
              <FolderOpen className="w-4 h-4 text-[#e2ec00]" />
              <span className="text-xs text-[#c9c8ab] font-medium leading-none">
                Adding to Section:{" "}
                <span className="text-[#e2ec00] font-semibold">
                  {sectionName}
                </span>
              </span>
            </div>
          </section>

          {/* Main glass-panel Form container */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input: Lesson Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block ml-1">
                Lesson Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Intro to Transformer Models"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-[#c9c8ab]/30 focus:outline-none focus:border-[#e2ec00] transition-all"
              />
            </div>

            {/* Input: Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block ml-1">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Briefly describe what students will learn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-[#c9c8ab]/30 focus:outline-none focus:border-[#e2ec00] transition-all resize-none"
              />
            </div>

            {/* Input: YouTube video ID */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block ml-1">
                YouTube Video ID
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Link className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="dQw4w9WgXcQ"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-[#c9c8ab]/30 focus:outline-none focus:border-[#e2ec00] transition-all font-mono"
                />
              </div>
            </div>

            {/* Status select & Display order split row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block ml-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "public" | "private" | "preview",
                    )
                  }
                  className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e2ec00] transition-all cursor-pointer"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="preview">Preview</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#c9c8ab] uppercase tracking-wider block ml-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e2ec00] transition-all"
                />
              </div>
            </div>

            {/* Form Actions button layout */}
            <div className="flex flex-col gap-2 pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-[#e2ec00] text-[#1c1d00] font-bold text-xs tracking-wider uppercase rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_12px_rgba(226,236,0,0.15)] flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Add Lesson
              </button>

              <DialogClose>
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-4 bg-transparent border border-[#252525] text-[#c9c8ab] hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
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
