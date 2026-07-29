"use client";

import { useState, useMemo } from "react";
import { Edit, Trash2, Video, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";
import CourseForm from "./CourseForm";

interface Course {
  id: string;
  name: string;
  description: string | null;
  section_count: number;
  lesson_count: number;
  updated_at: string;
}

interface CoursesTableProps {
  courses: Course[];
}

const ITEMS_PER_PAGE = 10;

export default function CoursesTable({ courses }: CoursesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        course.name.toLowerCase().includes(searchLower) ||
        (course.description &&
          course.description.toLowerCase().includes(searchLower))
      );
    });
  }, [courses, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="w-full">
      {/* Search Bar & Course Form - Responsive Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
        <div className="w-full sm:flex-1">
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search courses..."
          />
        </div>

        {/* Tool Bar Header (New Course button) */}
        <div className="flex items-center justify-stretch sm:justify-end w-full sm:w-auto">
          <CourseForm />
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl overflow-hidden border border-[#252525] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#201f1f]/80 border-b border-[#252525]/80">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider">
                  Course Details
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider hidden sm:table-cell">
                  Section Count
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider hidden md:table-cell">
                  Lesson Count
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider hidden lg:table-cell">
                  Last Modified
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-[#c9c8ab] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]/40">
              {paginatedCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 sm:px-6 py-6 sm:py-8 text-center text-sm sm:text-base text-[#c9c8ab]"
                  >
                    {searchQuery
                      ? "No courses match your search"
                      : "No courses found"}
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="cursor-pointer transition-colors hover:bg-[#201f1f]/40"
                  >
                    {/* Course Details Block */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-12 h-8 sm:w-16 sm:h-10 rounded-lg overflow-hidden border border-[#252525] shrink-0 bg-[#252525]">
                          <Video className="w-full h-full object-cover text-[#c9c8ab]/40" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-white truncate">
                            {course.name}
                          </p>
                          <p
                            title={course.description || "No description"}
                            className="text-xs text-[#c9c8ab] line-clamp-1 hidden xs:block"
                          >
                            {course.description ||
                              "No description provided for this course."}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Section Count - Hidden on mobile */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#c9c8ab] hidden sm:table-cell">
                      {course.section_count}
                    </td>

                    {/* Lesson Count - Hidden on tablet and below */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#c9c8ab] hidden md:table-cell">
                      {course.lesson_count}
                    </td>

                    {/* Last Modified - Hidden on tablet and below */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs text-[#c9c8ab] text-nowrap hidden lg:table-cell">
                      {new Date(course.updated_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Actions Trigger */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-2 sm:gap-3">
                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="inline-flex items-center justify-center p-2 sm:p-1.5 rounded-lg text-[#c9c8ab] hover:text-white hover:bg-[#252525] transition-all"
                          title="Edit course"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="inline-flex items-center justify-center p-2 sm:p-1.5 rounded-lg text-[#c9c8ab] hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Course Footer Grid summary */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-[#201f1f]/30 border-t border-[#252525] flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs text-[#c9c8ab] text-center sm:text-left">
            Showing {paginatedCourses.length > 0 ? startIndex + 1 : 0}-
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredCourses.length)} of{" "}
            {filteredCourses.length} course
            {filteredCourses.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-1 sm:gap-2 items-center w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || totalPages === 0}
              className="p-2 sm:p-2 rounded-lg border border-[#252525] text-[#c9c8ab] hover:text-white hover:bg-[#252525] disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>

            {/* Page Numbers - Hidden on mobile, show from sm: */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? "bg-brand-yellow text-[#1c1d00]"
                        : "border border-[#252525] text-[#c9c8ab] hover:text-white hover:bg-[#252525]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden text-xs text-[#c9c8ab] px-2">
              {currentPage} / {totalPages || 1}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 sm:p-2 rounded-lg border border-[#252525] text-[#c9c8ab] hover:text-white hover:bg-[#252525] disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
