"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  Video,
} from "lucide-react";
import {
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_SECTIONS,
} from "@/app/constants";
import { useRouter } from "next/navigation";

interface CourseManagementViewProps {
  courses: Course[];
  sections: Section[];
  lessons: Lesson[];
  onNewCourseClick: () => void;
  onAddSectionClick: (courseId: string) => void;
  onAddLessonClick: (sectionId: string) => void;
  onDeleteCourseClick: (id: string) => void;
}

export default function CoursesPage({
  courses = INITIAL_COURSES,
  sections = INITIAL_SECTIONS,
  lessons = INITIAL_LESSONS,
  onNewCourseClick,
  onAddSectionClick,
  onAddLessonClick,
  onDeleteCourseClick,
}: CourseManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [courses, searchQuery]);

  return (
    <div className="flex-1 w-full space-y-8 pb-16">
      {/* Page Title & Main Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Courses
          </h1>
          <p className="text-sm text-[#c9c8ab]">
            Coordinate curriculums and sequence educational models.
          </p>
        </div>
      </div>

      {/* Tool Bar Header (Search and New Course button) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#141414] p-3 rounded-2xl border border-[#252525]">
        <div className="relative w-full max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9c8ab]">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-[#c9c8ab]/40 focus:outline-none focus:border-[#e2ec00] transition-all"
          />
        </div>

        <button
          onClick={onNewCourseClick}
          className="w-full md:w-auto bg-[#e2ec00] text-[#1c1d00] hover:brightness-110 active:scale-95 transition-all px-5 py-3 rounded-xl font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-[0_4px_12px_rgba(226,236,0,0.15)] uppercase select-none"
        >
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>

      {/* Main Table Panel */}
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl overflow-hidden border border-[#252525] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#201f1f]/80 border-b border-[#252525]/80">
                <th className="px-6 py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
                  Course Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
                  Section Count
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
                  Lesson Count
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]/40">
              {filteredCourses.map((course) => {
                return (
                  <tr
                    key={course.id}
                    className="cursor-pointer transition-colors hover:bg-[#201f1f]/40"
                  >
                    {/* Course Details Block */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-[#252525] shrink-0 bg-[#252525]">
                          <Video className="w-full h-full object-cover text-[#c9c8ab]/40" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">
                            {course.name}
                          </p>
                          <p className="text-xs text-[#c9c8ab]">
                            {course.description ||
                              "No description provided for this course."}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Session Count */}
                    <td className="px-6 py-4 text-sm text-[#c9c8ab]">
                      {sections.filter((s) => s.courseId === course.id).length}
                    </td>

                    {/* Lesson Count */}
                    <td className="px-6 py-4 text-sm text-[#c9c8ab]">
                      {
                        lessons.filter((l) => {
                          const section = sections.find(
                            (s) => s.id === l.sectionId,
                          );
                          return section?.courseId === course.id;
                        }).length
                      }
                    </td>

                    {/* Last Modified */}
                    <td className="px-6 py-4 text-xs text-[#c9c8ab]">
                      {course.lastModified}
                    </td>

                    {/* Actions Trigger */}
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="justify-self-end flex justify-between gap-10 text-left">
                        <button
                          onClick={() =>
                            router.push(`/admin/courses/${course.id}/edit`)
                          }
                        >
                          <Edit className="w-5 h-5 text-[#c9c8ab] hover:text-white cursor-pointer" />
                        </button>
                        <button>
                          <Trash2 className="w-5 h-5 text-[#c9c8ab] hover:text-white cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Course Footer Grid summary */}
        <div className="px-6 py-4 bg-[#201f1f]/30 border-t border-[#252525] flex justify-between items-center flex-col sm:flex-row gap-4">
          <p className="text-xs text-[#c9c8ab]">
            Showing 1-{filteredCourses.length} of {courses.length} courses
            listed
          </p>
          <div className="flex gap-2">
            <button
              className="p-2 rounded-lg border border-[#252525] text-[#c9c8ab] hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg border border-[#252525] text-[#c9c8ab] hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              disabled
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
