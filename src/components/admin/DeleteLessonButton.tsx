"use client";

import { Trash2 } from "lucide-react";
import { deleteLesson } from "@/features/lessons/action";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteLessonButtonProps {
  lessonId: string;
  lessonName: string;
}

export default function DeleteLessonButton({ lessonId, lessonName }: DeleteLessonButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${lessonName}"?`);
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteLesson(lessonId);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lesson");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 rounded-lg hover:bg-white/10 text-[#c9c8ab]/60 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
      title="Delete Lesson"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
