"use client";

import { ChevronDown } from "lucide-react";
import LessonList from "./LessonList";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SectionList({
  courseId,
  sections,
}: {
  courseId: string;
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
      {(() =>
        sections.map((section) => {
          const isCollapsed = !!collapsedSections[section.id];

          return (
            <div key={section.id}>
              <div className="border border-[#252525] bg-[#111]/40 rounded-xl overflow-hidden">
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

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/5 border border-white/10 text-[#c9c8ab] px-2 py-0.5 rounded font-mono uppercase">
                      {section.status}
                    </span>
                  </div>
                </div>

                {!isCollapsed && (
                  <LessonList courseId={courseId} lessons={section.lessons} />
                )}
              </div>
            </div>
          );
        }))()}
    </div>
  );
}
