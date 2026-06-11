"use client";

import { Trash2 } from "lucide-react";
import { deleteSection } from "@/features/sections/action";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteSectionButtonProps {
  sectionId: string;
  sectionName: string;
}

export default function DeleteSectionButton({ sectionId, sectionName }: DeleteSectionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete section "${sectionName}"? This will also delete all lessons inside it.`
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteSection(sectionId);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete section");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 rounded-lg hover:bg-white/10 text-[#c9c8ab]/60 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
      title="Delete Section"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
