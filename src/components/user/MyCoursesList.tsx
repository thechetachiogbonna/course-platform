"use client";

import Image from "next/image";
import { PlayCircle, Award, BookOpen } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export interface UserCourse {
  courseId: string;
  courseName: string;
  courseDescription: string | null;
  courseImageUrl: string | null;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  category?: string;
}

type Filter = "all" | "in-progress" | "completed";

function ProgressBar({ percent }: { percent: number }) {
  const isComplete = percent >= 100;
  return (
    <div className="w-full h-1.5 bg-[#353534] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          isComplete ? "bg-green-500" : "bg-[#e2ec00]"
        }`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

function CourseCard({ course }: { course: UserCourse }) {
  const isComplete = course.progressPercent >= 100;
  const hasStarted = course.completedLessons > 0;

  return (
    <div className="glass-card rounded-xl overflow-hidden group hover:border-[#e2ec00]/50 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-[#1c1b1b]">
        {course.courseImageUrl ? (
          <Image
            src={course.courseImageUrl}
            alt={course.courseName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-[#474746]" />
          </div>
        )}
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Category tag */}
        {course.category && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-[#0e0e0e]/80 backdrop-blur-md rounded text-[10px] font-bold text-[#e2ec00] border border-[#474832]/30 uppercase tracking-wider">
            {course.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title + progress label */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-semibold text-white leading-snug">
            {course.courseName}
          </h3>
          {isComplete ? (
            <span className="text-xs font-bold text-green-400 shrink-0">Done</span>
          ) : (
            <span className="text-xs font-bold text-[#e2ec00] shrink-0">
              {course.progressPercent}%
            </span>
          )}
        </div>

        {/* Progress bar */}
        <ProgressBar percent={course.progressPercent} />

        {/* Description */}
        {course.courseDescription && (
          <p className="text-xs text-[#c9c8ab] opacity-80 leading-relaxed line-clamp-2">
            {course.courseDescription}
          </p>
        )}

        {/* CTA */}
        {isComplete ? (
          <button
            id={`btn-certificate-${course.courseId}`}
            className="mt-2 w-full py-3 bg-[#2a2a2a] text-white border border-[#474832]/50 font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-[#353534] active:scale-95 transition-all"
          >
            View Certificate
            <Award className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href={`/courses/${course.courseId}`}
            id={`btn-continue-${course.courseId}`}
            className="mt-2 w-full py-3 bg-[#e2ec00] text-[#1b1d00] font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            {hasStarted ? "Continue Learning" : "Start Learning"}
            <PlayCircle className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MyCoursesList({ courses }: { courses: UserCourse[] }) {
  const { user } = useUser();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const userImageUrl = user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBYkQjXjpr0ph-fTeE_5dG1ikEMmlOMEprfF1Ir8uN3wqMEGcsRpCcA9kAL5lO8TEaJU985JGdwWY2k2XL5IYD7jHduKg0iBPw7nGMc3yDtwwlkf8YZYnQ8kMWbxsWjglXIZgYhnGlScjxP9-X_AaXaBCzkYWFbTmixv4Fk-7aR96jeorA2vnXtWmb5VzFQPZRG_K9vq8oVjDZewmIsIis_GnJdKiMamDSWo6Y6uaIoJxvqKTfhVxbHMzlL7Lq0A07LY0MxdjPqBf8";

  const filtered = courses.filter((c) => {
    const matchesSearch = c.courseName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && c.progressPercent >= 100) ||
      (filter === "in-progress" && c.progressPercent < 100 && c.completedLessons > 0);

    return matchesSearch && matchesFilter;
  });

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="w-full space-y-6 pb-24 relative">
      {/* Glow Background */}
      <div className="fixed inset-0 pointer-events-none glow-bg z-0" />

      {/* Page heading */}
      <div className="space-y-4 relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
          My Courses
        </h1>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929277]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="course-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your purchases..."
            className="w-full bg-[#1c1b1b] border border-[#474832]/30 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-[#929277]/50 focus:outline-none focus:border-[#e2ec00] focus:ring-1 focus:ring-[#e2ec00] transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.value}
              id={`filter-${f.value}`}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${
                filter === f.value
                  ? "bg-[#e2ec00] text-[#1b1d00]"
                  : "bg-[#2a2a2a] text-[#929277] border border-[#474832]/30 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
          {filtered.map((course) => (
            <CourseCard key={course.courseId} course={course} />
          ))}
        </div>
      ) : (
        <div className="bg-[#181818] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
          <BookOpen className="w-12 h-12 text-[#474746]" />
          <p className="text-sm font-bold text-white">No courses found.</p>
          <p className="text-xs text-[#929277] max-w-xs">
            {search
              ? `No courses match "${search}". Try a different search.`
              : "You haven't enrolled in any courses yet. Browse products to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
