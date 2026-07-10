import { Circle, Eye, Lock, PlaySquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LessonList({
  courseId,
  lessons,
}: {
  courseId: string;
  lessons: Lesson[];
}) {
  const getLessonIcon = (status: "public" | "preview" | "private") => {
    switch (status) {
      case "preview":
        return <Eye className="h-4 w-4 text-brand-yellow shrink-0" />;

      case "private":
        return <Lock className="h-4 w-4 text-red-500 shrink-0" />;

      default:
        return <Circle className="h-4 w-4 text-white/30 shrink-0" />;
    }
  };

  return (
    <div className="divide-y divide-[#252525]/20">
      <div>
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/courses/${courseId}/lessons/${lesson.id}`}
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
                  {getLessonIcon(lesson.status)}
                  
                  {lesson.duration > 0 && (
                    <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-2">
                      <span className="text-[10px] text-[#c9c8ab] font-mono">
                        {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
