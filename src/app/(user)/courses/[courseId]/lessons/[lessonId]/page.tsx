import YouTubeVideoPlayer from "@/components/admin/YoutubeVideoPlayer";
import LessonPlayerSidebar from "@/components/user/LessonPlayerSidebar";
import { db } from "@/database/db";
import { userCanAccessCourse } from "@/features/courses/action";
import { getCurrentUser } from "@/features/users/action";
import { getUserCoupon } from "@/lib/user-country-header";
import { formatDate, getCurrentStreak, formatPrice } from "@/lib/utils";
import { Lock, Menu } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type CourseWithProduct = Course & { productId: string; productPrice: number };

interface CourseDetails extends CourseWithProduct {
  sections: (Section & {
    lessons: (Lesson & {
      progressInSeconds: number | null;
      completed: boolean;
    })[];
  })[];
}

const getCourseSectionsLessons = async (courseId: string, userId: string) => {
  const result = await db.query(
    `
      SELECT
        c.id AS course_id,
        c.name AS course_name,
        c.description AS course_description,

        s.id AS section_id,
        s.name AS section_name,
        s.status AS section_status,
        s.order AS section_order,

        l.id AS lesson_id,
        l.name AS lesson_name,
        l.description AS lesson_description,
        l.status AS lesson_status,
        l.order AS lesson_order,
        l.youtube_video_id AS lesson_youtube_video_id,
        l.duration AS lesson_duration,
        ulp.progress_seconds AS progress_seconds,
        ulp.completed AS completed,

        p.id AS product_id,
        p.price AS product_price
      FROM courses c
      JOIN sections s
        ON c.id = s.course_id
      JOIN lessons l
        ON s.id = l.section_id
      LEFT JOIN user_lesson_progress AS ulp
        ON l.id = ulp.lesson_id AND ulp.user_id = $2
      LEFT JOIN course_products cp
        ON c.id = cp.course_id
      JOIN products p
        ON p.id = cp.product_id
      WHERE c.id = $1 AND s.status = 'public' AND l.status IN ('preview', 'public')
      ORDER BY s.order ASC, l.order ASC
    `,
    [courseId, userId],
  );

  const firstRow = result.rows[0];

  const coupon = await getUserCoupon();

  const productPrice = coupon
    ? firstRow.product_price * (1 - coupon.discountPercentage)
    : firstRow.product_price;

  const course = {
    id: firstRow.course_id,
    name: firstRow.course_name,
    description: firstRow.course_description,
    updated_at: firstRow.updated_at,
    productId: firstRow.product_id,
    productPrice,
    sections: [],
  } as CourseDetails;

  const sectionMap = new Map();
  const seenLessonIds = new Set<string>();

  for (const row of result.rows) {
    if (row.section_id && !sectionMap.has(row.section_id)) {
      const section = {
        id: row.section_id,
        name: row.section_name,
        status: row.section_status,
        order: row.section_order,
        courseId: row.courseId,
        lessons: [],
      };

      sectionMap.set(row.section_id, section);
      course.sections.push(section);
    }

    if (row.lesson_id && !seenLessonIds.has(row.lesson_id)) {
      seenLessonIds.add(row.lesson_id);
      sectionMap.get(row.section_id)?.lessons.push({
        id: row.lesson_id,
        name: row.lesson_name,
        description: row.lesson_description,
        youtubeVideoId: row.lesson_youtube_video_id,
        status: row.lesson_status,
        order: row.lesson_order,
        duration: Number(row.lesson_duration || 0),
        progressInSeconds: row.progress_seconds,
        completed: row.completed || false,
      });
    }
  }

  return course;
};

const getUserStreak = async (userId: string) => {
  const result = await db.query(
    `
      SELECT 
        activity_date,
        seconds_watched
      FROM user_daily_activity 
      WHERE user_id = $1
    `,
    [userId],
  );

  const activity = result.rows.map((row) => ({
    date: formatDate(new Date(row.activity_date)),
    secondsWatched: row.seconds_watched,
  })) as ActivityDay[];

  return getCurrentStreak(activity.map((day) => day.date));
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string; courseId: string }>;
}) {
  const { lessonId, courseId } = await params;
  const { user } = await getCurrentUser();
  const [course, streak, canAccessCourse] = await Promise.all([
    getCourseSectionsLessons(courseId, user.id),
    getUserStreak(user.id),
    userCanAccessCourse(user.id, courseId),
  ]);

  if (!course) return notFound();

  const activeLesson = course.sections
    .flatMap((section) => section.lessons)
    .find((lesson) => lesson.id === lessonId);

  const notFoundLessonContent = (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Select a Lesson</h2>

      <p className="text-[#c9c8ab] mb-8">
        Choose a lesson from the sidebar to start learning.
      </p>

      <Menu className="w-16 h-16 text-brand-yellow/70" />
    </div>
  );

  return (
    <div className="-mx-4 -my-6 flex flex-row min-h-screen w-[calc(100%+2rem)] bg-background-dark text-[#e5e2e1] overflow-hidden!">
      <LessonPlayerSidebar
        activeLessonId={lessonId}
        courseId={courseId}
        courseName={course.name}
        sections={course.sections}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden custom-scrollbar">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 w-full bg-[#131313]/90 backdrop-blur-xl border-b border-[#252524]">
          <div className="flex items-center gap-6">
            <Menu
              id="menu-btn"
              className="w-5 h-5 md:hidden cursor-pointer text-[#c9c8ab] hover:text-white transition-colors"
            />
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-medium text-[#e5e2e1]">
                {activeLesson?.name ?? "Lesson Unavailable"}
              </span>
            </div>
          </div>

          <div className="max-md:mr-8 flex px-4 py-1.5 bg-[#1c1b1b] rounded-full border border-[#252524]">
            <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-widest">
              Streak: {streak} Days 🔥
            </span>
          </div>
        </header>

        {!activeLesson ? (
          notFoundLessonContent
        ) : (
          <div className="p-6 md:p-8 flex-1 flex flex-col gap-8 pb-32 w-full max-w-4xl mx-auto">
            {/* Video Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black electric-glow-large border border-white/5 group shadow-2xl">
              {activeLesson.status !== "preview" && !canAccessCourse ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0c]/95 backdrop-blur-md p-6 md:p-8 text-center select-none">
                  {/* Glowing Lock Icon Container */}
                  <div className="relative mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 shadow-[0_0_20px_rgba(229,226,225,0.05)]">
                    <Lock className="w-6 h-6 text-brand-yellow animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-brand-yellow/5 animate-ping opacity-30" />
                  </div>

                  {/* Paywall Info */}
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                    This Lesson is Locked
                  </h3>
                  <p className="text-sm text-[#c9c8ab]/90 max-w-md mb-6 leading-relaxed">
                    To view this lesson and gain full access to all sections,
                    exercises, and resources, please enroll in the course.
                  </p>

                  {/* Interactive Action Button */}
                  <Link
                    href={`/products/${course.productId}`}
                    className="inline-flex items-center justify-center bg-brand-yellow hover:brightness-110 active:scale-95 text-black px-6 py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all shadow-[0_4px_20px_rgba(198,207,0,0.25)]"
                  >
                    Unlock Course for {formatPrice(course.productPrice)}
                  </Link>
                </div>
              ) : (
                <YouTubeVideoPlayer
                  action={true}
                  userId={user.id}
                  lessonId={activeLesson.id}
                  videoId={activeLesson?.youtubeVideoId}
                  stoppedAt={activeLesson?.progressInSeconds || 0}
                  completed={activeLesson?.completed || false}
                />
              )}
            </div>

            {/* Info Section with Tabs */}
            <div className="space-y-8">
              <div className="border-b border-[#252524] overflow-x-auto no-scrollbar">
                <div className="w-fit pb-4 font-semibold text-sm whitespace-nowrap transition-all duration-200 border-b-[3px] border-brand-yellow text-white">
                  Description
                </div>
              </div>
              <div className="space-y-5">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  About this Lesson
                </h3>
                <div className="prose prose-invert max-w-none text-[#c9c8ab] space-y-5 text-base leading-relaxed">
                  <p>{activeLesson.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
