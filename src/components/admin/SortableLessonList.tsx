"use client";

import { Edit, PlaySquare } from "lucide-react";
import LessonForm from "./LessonForm";
import { cn } from "@/lib/utils";
import { SortableItem, SortableList } from "./SortableList";
import { deleteLesson, updateLessonOrder } from "@/features/lessons/action";
import DeleteActionButton from "@/components/ui/DeleteActionButton";

export default function SortableLessonList({
  sections,
  section,
}: {
  sections: Section[];
  section: Section & { lessons: Lesson[] };
}) {
  if (section.lessons.length === 0) {
    return (
      <div className="divide-y divide-[#252525]/20">
        <div className="p-4 text-center text-xs text-gray-500 italic">
          No lessons recorded in this section module. Press "Add Lesson" to
          populate clips.
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#252525]/20">
      <SortableList
        lists={section.lessons}
        courseId={section.courseId}
        orderChangeHandler={updateLessonOrder}
      >
        {(items, isPending) =>
          items.map((lesson, index) => (
            <SortableItem
              key={lesson.id}
              id={lesson.id}
              index={index}
              isPending={isPending}
              listType="lesson"
            >
              <div
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors",
                )}
              >
                <div className="p-2 rounded-lg bg-brand-yellow/10 text-brand-yellow shrink-0 mt-0.5">
                  <PlaySquare className="w-4 h-4" />
                </div>

                <div className="grow min-w-0">
                  <div className="flex items-start gap-2 justify-between w-full">
                    <div className="flex flex-col justify-center items-start min-w-0">
                      <h5 className="text-xs font-bold text-white truncate w-full">
                        {lesson.name}
                      </h5>

                      <p className="text-[11px] text-[#c9c8ab] mt-1 lead-relaxed line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] text-[#c9c8ab]/60 font-mono">
                        Order: {lesson.order}
                      </span>

                      <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded font-bold uppercase text-brand-yellow">
                        {lesson.status}
                      </span>

                      <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-2">
                        <LessonForm
                          type="edit"
                          sectionName={section.name}
                          sectionId={section.id}
                          lesson={lesson}
                          sections={sections}
                        >
                          <button
                            className="p-1.5 rounded-lg hover:bg-white/10 text-[#c9c8ab]/60 hover:text-brand-yellow transition-colors cursor-pointer"
                            title="Edit Lesson"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </LessonForm>

                        <DeleteActionButton
                          onDelete={() => deleteLesson(lesson.id)}
                          itemName={lesson.name}
                          title="Delete Lesson"
                          description={`This action cannot be undone. This will permanently delete "${lesson.name}".`}
                          errorMessage="Failed to delete lesson"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-[#c9c8ab]/60 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                          iconClassName="w-3.5 h-3.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SortableItem>
          ))
        }
      </SortableList>
    </div>
  );
}
