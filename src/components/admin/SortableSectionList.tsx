"use client";

import { useState } from "react";
import { ChevronDown, Edit, Plus } from "lucide-react";
import LessonForm from "./LessonForm";
import SortableLessonList from "./SortableLessonList";
import { SortableItem, SortableList } from "./SortableList";
import SectionForm from "./SectionForm";
import { deleteSection, updateSectionOrder } from "@/features/sections/action";
import { cn } from "@/lib/utils";
import DeleteActionButton from "@/components/ui/DeleteActionButton";

export default function SortableSectionList({
  course,
  sections,
}: {
  course: Course;
  sections: (Section & { lessons: Lesson[] })[];
}) {
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (sections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-xs font-mono">
        Syllabus structure empty. Click "Add Section" to compile curriculum
        blocks.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SortableList
        lists={sections}
        courseId={course.id}
        orderChangeHandler={updateSectionOrder}
      >
        {(items, isPending) =>
          items.map((section, index) => {
            return (
              <SortableItem
                key={section.id}
                id={section.id}
                index={index}
                isPending={isPending}
                listType="section"
              >
                {(() => {
                  const isCollapsed = !!collapsedSections[section.id];

                  return (
                    <div className="border border-[#252525] bg-[#111]/40 rounded-xl overflow-hidden">
                      {/* Section Header */}
                      <div
                        className={cn(
                          "bg-[#1e1e1e]/60 p-4 flex items-center justify-between flex-wrap gap-2 cursor-pointer select-none",
                          !isCollapsed && "border-b border-[#252525]/40",
                        )}
                        onClick={() => toggleSection(section.id)}
                      >
                        <div className="flex items-center gap-3">
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-[#c9c8ab] transition-transform duration-200",
                              isCollapsed && "-rotate-90",
                            )}
                          />
                          <div>
                            <span className="text-[10px] text-[#c9c8ab] font-mono">
                              SECTION #{section.order}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-0.5">
                              {section.name}
                            </h4>
                          </div>
                        </div>

                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] bg-white/5 border border-white/10 text-[#c9c8ab] px-2 py-0.5 rounded font-mono uppercase">
                            {section.status}
                          </span>

                          {/* Section edit/delete actions */}
                          <div className="flex items-center gap-1 border-r border-white/10 pr-2">
                            <SectionForm
                              type="edit"
                              courseName={course.name}
                              courseId={course.id}
                              section={section}
                            >
                              <button
                                className="p-1.5 rounded-lg hover:bg-white/10 text-[#c9c8ab]/60 hover:text-brand-yellow transition-colors cursor-pointer"
                                title="Edit Section"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </SectionForm>
                            <DeleteActionButton
                              onDelete={() =>
                                deleteSection(section.id, course.id)
                              }
                              itemName={section.name}
                              title="Delete Section"
                              description={`This action cannot be undone. This will permanently delete "${section.name}" and all lessons inside it.`}
                              errorMessage="Failed to delete section"
                              className="p-1.5 rounded-lg hover:bg-white/10 text-[#c9c8ab]/60 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                              iconClassName="w-3.5 h-3.5"
                            />
                          </div>

                          <LessonForm
                            type="create"
                            sectionName={section.name}
                            sectionId={section.id}
                            nextLessonOrder={section.lessons.length + 1}
                            sections={sections.map(
                              ({ lessons, ...sections }) => sections,
                            )}
                          >
                            <div className="cursor-pointer text-brand-yellow hover:text-white border border-brand-yellow/20 hover:border-brand-yellow text-[10px] font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition-all">
                              <Plus className="w-3 h-3" />
                              <span>Add Lesson</span>
                            </div>
                          </LessonForm>
                        </div>
                      </div>

                      {/* Section Lessons */}
                      {!isCollapsed && (
                        <SortableLessonList
                          sections={sections.map(
                            ({ lessons, ...sections }) => sections,
                          )}
                          section={section}
                        />
                      )}
                    </div>
                  );
                })()}
              </SortableItem>
            );
          })
        }
      </SortableList>
    </div>
  );
}
