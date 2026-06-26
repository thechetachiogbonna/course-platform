import LessonList from "./LessonList";
import { cn } from "@/lib/utils";

export default function SectionList({
  courseId,
  sections,
}: {
  courseId: string;
  sections: (Section & { lessons: Lesson[] })[];
}) {
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
      {sections.map((section) => {
        return (
          <div key={section.id}>
            <div className="border border-[#252525] bg-[#111]/40 rounded-xl overflow-hidden">
              <div
                className={cn(
                  "bg-[#1e1e1e]/60 p-4 flex items-center justify-between flex-wrap gap-2 select-none",
                )}
              >
                <div className="flex items-center gap-3">
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

              {section.status === "private" ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  Private section - locked
                </div>
              ) : (
                <LessonList courseId={courseId} lessons={section.lessons} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
