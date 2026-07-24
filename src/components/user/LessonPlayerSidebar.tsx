"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  X,
  CheckCircle2,
  ChevronDown,
  Eye,
  Circle,
  Lock,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface LessonPlayerSidebarProps {
  sections: (Section & { lessons: (Lesson & { completed: boolean })[] })[];
  activeLessonId: string;
  courseId: string;
  courseName: string;
}

export default function LessonPlayerSidebar({
  sections,
  activeLessonId,
  courseId,
  courseName,
}: LessonPlayerSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sections.map((section) => [section.id, true])),
  );

  useEffect(() => {
    const button = document.getElementById("menu-btn");

    const handleClick = () => {
      setIsOpen(true);
    };

    button?.addEventListener("click", handleClick);

    return () => {
      button?.removeEventListener("click", handleClick);
    };
  }, []);

  const getLessonIcon = ({
    completed,
    status,
  }: {
    completed: boolean;
    status: "public" | "preview" | "private";
  }) => {
    if (completed) {
      return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
    }

    switch (status) {
      case "preview":
        return <Eye className="h-4 w-4 text-brand-yellow shrink-0" />;

      case "private":
        return <Lock className="h-4 w-4 text-red-500 shrink-0" />;

      default:
        return <Circle className="h-4 w-4 text-white/30 shrink-0" />;
    }
  };

  const totalLessons = sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0,
  );

  const completedLessons = sections.reduce(
    (acc, section) =>
      acc + section.lessons.filter((lesson) => lesson.completed).length,
    0,
  );

  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <aside
      className={cn(
        "fixed top-0 max-h-screen z-50 w-[85vw] md:w-80 md:sticky md:translate-x-0",
        "bg-[#161615] border-r border-[#252524] overflow-hidden",
        "transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#252524]">
        <div className="flex items-center justify-between">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-2 text-brand-yellow hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Back to Course
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-white mt-5">{courseName}</h2>

        <div className="mt-4 h-1.5 w-full bg-[#201f1f] rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-yellow transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs font-medium text-[#c9c8ab]">
          {completedLessons} of {totalLessons} lessons completed ({progress}%)
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-scroll custom-scrollbar p-2 space-y-4 pb-12">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  [section.id]: !prev[section.id],
                }))
              }
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#c9c8ab] uppercase tracking-wider">
                  {section.name}
                </span>

                {!openSections[section.id] && (
                  <span className="text-left text-[10px] mt-1 ml-2 font-medium text-[#c9c8ab]">
                    {section.lessons.length} lessons
                  </span>
                )}
              </div>

              <ChevronDown
                className={cn(
                  "w-4 h-4 text-[#c9c8ab] transition-transform duration-300",
                  openSections[section.id] && "rotate-180",
                )}
              />
            </button>

            {openSections[section.id] && (
              <div className="space-y-1 mt-1">
                {section.lessons.map((lesson) => {
                  const isCompleted = lesson.completed;
                  const isActive = activeLessonId === lesson.id;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-all group",
                        isActive
                          ? "bg-brand-yellow/10 border border-brand-yellow/20 text-white"
                          : "text-white/60 hover:bg-[#201f1f]",
                      )}
                    >
                      {getLessonIcon({
                        status: lesson.status as "public" | "preview",
                        completed: isCompleted,
                      })}

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-3">
                          <span title={lesson.name} className="truncate">
                            {lesson.name}
                          </span>

                          <div className="flex items-end gap-2">
                            <span className="font-mono text-[11px]">
                              {`${Math.floor(lesson.duration / 60)}:${String(Math.floor(lesson.duration % 60)).padStart(2, "0")}`}
                            </span>

                            {lesson.status === "preview" && (
                              <Badge className="bg-brand-yellow text-black hover:bg-brand-yellow text-[10px] font-bold uppercase rounded-full px-2 py-0">
                                Free
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
