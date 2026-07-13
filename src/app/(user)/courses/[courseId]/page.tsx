import SectionList from "@/components/user/SectionList";
import { db } from "@/database/db";
import { getCurrentUser } from "@/features/users/action";
import { formatString } from "@/lib/utils";
import { Play } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type LessonWithLastWatched = Lesson & { lastWatched: string | null };

interface CourseDetails extends Course {
  sections: (Section & { lessons: LessonWithLastWatched[] })[];
}

const getCourse = async (courseId: string, userId: string) => {
  const result = await db.query(
    `
      SELECT
        c.id AS course_id,
        c.name AS course_name,
        c.description AS course_description,
        c.updated_at AS course_updated_at,

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

        ulp.updated_at AS last_watched
      FROM courses c
      LEFT JOIN sections s
        ON s.course_id = c.id AND s.status = 'public'
      LEFT JOIN lessons l
        ON l.section_id = s.id AND l.status IN ('public', 'preview')
      LEFT JOIN user_lesson_progress ulp
        ON ulp.user_id = $2 AND ulp.lesson_id = l.id

      WHERE c.id = $1
      ORDER BY s.order ASC, l.order ASC;
    `,
    [courseId, userId],
  );

  if (!result.rows.length) {
    return null;
  }

  const firstRow = result.rows[0];

  const course: CourseDetails = {
    id: firstRow.course_id,
    name: firstRow.course_name,
    description: firstRow.course_description,
    updated_at: firstRow.course_updated_at,
    sections: [],
  };

  const sectionMap = new Map<
    string,
    Section & { lessons: LessonWithLastWatched[] }
  >();

  for (const row of result.rows) {
    if (row.section_id && !sectionMap.has(row.section_id)) {
      const section = {
        id: row.section_id,
        name: row.section_name,
        status: row.section_status,
        order: row.section_order,
        courseId: row.course_id,
        lessons: [],
      };

      sectionMap.set(row.section_id, section);
      course.sections.push(section);
    }

    if (row.lesson_id) {
      sectionMap.get(row.section_id)?.lessons.push({
        id: row.lesson_id,
        name: row.lesson_name,
        description: row.lesson_description,
        youtubeVideoId: row.lesson_youtube_video_id,
        status: row.lesson_status,
        order: row.lesson_order,
        duration: Number(row.lesson_duration || 0),
        lastWatched: row.last_watched,
      } as LessonWithLastWatched);
    }
  }

  return course;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const { user } = await getCurrentUser();
  const course = await getCourse(courseId, user.id);
  if (!course) {
    return {
      title: "Course Not Found",
    };
  }
  return {
    title: course.name,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { user } = await getCurrentUser();
  const course = await getCourse(courseId, user.id);
  if (!course) notFound();

  const totalLessons = course.sections?.reduce(
    (acc, section) => acc + section.lessons.length,
    0,
  );
  const totalSections = course.sections.length;

  const lastWatchedLesson = course.sections
    .flatMap((section) => section.lessons)
    .reduce<LessonWithLastWatched | null>((latest, lesson) => {
      if (!lesson.lastWatched) return latest;
      if (!latest) return lesson;

      return new Date(lesson.lastWatched) > new Date(latest.lastWatched!)
        ? lesson
        : latest;
    }, null);

  const firstLesson = course.sections[0]?.lessons[0];

  const currentLesson = lastWatchedLesson ?? firstLesson;

  const heroImage = `https://img.youtube.com/vi/${currentLesson.youtubeVideoId}/maxresdefault.jpg`;

  const actionText = lastWatchedLesson ? "Continue Learning" : "Start Learning";
  
  return (
    <div className="w-full max-w-5xl mx-auto pb-28">
      <section className="relative w-full h-[50dvh] md:h-100 rounded-2xl overflow-hidden mb-8 mx-0">
        <Image
          src={heroImage}
          alt={course.name}
          fill
          priority
          className="object-cover"
          referrerPolicy="no-referrer"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/40 to-transparent" />

        <div className="absolute -bottom-8 left-0 w-full px-6 pb-8">
          <p className="text-brand-yellow font-medium text-sm mb-2">
            {actionText}
          </p>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            {course.name}
          </h1>

          <p className="text-white/90 mt-2 text-lg">{currentLesson?.name}</p>

          <div className="flex items-center gap-3 mt-3 text-sm text-white/70">
            <span>
              {formatString({
                number: totalSections,
                singular: "Section",
                plural: "Sections",
              })}
            </span>

            <span>•</span>

            <span>
              {formatString({
                number: totalLessons,
                singular: "Lesson",
                plural: "Lessons",
              })}
            </span>

            {currentLesson && (
              <>
                <span>•</span>
                <span>{Math.ceil(currentLesson.duration / 60)} min</span>
              </>
            )}
          </div>

          {currentLesson && (
            <Link
              href={`/courses/${course.id}/lessons/${currentLesson.id}`}
              className="inline-flex items-center gap-2 mt-6 bg-brand-yellow text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              <Play className="size-5 fill-current" />
              {lastWatchedLesson ? "Continue Watching" : "Start Course"}
            </Link>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 px-0">
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">
              About this course
            </h2>
            <p className="text-sm text-[#c9c8ab] leading-relaxed">
              {course.description}
            </p>
          </section>

          {/* Sections */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Sections</h2>
              <span className="text-xs text-[#929277]">
                {formatString({
                  number: Number(totalSections),
                  plural: "Sections",
                  singular: "Section",
                })}{" "}
                •{" "}
                {formatString({
                  number: Number(totalLessons),
                  plural: "Lessons",
                  singular: "Lesson",
                })}
              </span>
            </div>

            <SectionList courseId={course.id} sections={course.sections} />
          </section>
        </div>
      </div>
    </div>
  );
}
