import SectionList from "@/components/user/SectionList";
import { db } from "@/database/db";
import { formatString } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

interface CourseDetails extends Course {
  sections: (Section & { lessons: Lesson[] })[];
}

const getCourse = async (courseId: string) => {
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
        l.youtube_video_id AS lesson_youtube_video_id

      FROM courses c
      LEFT JOIN sections s
        ON s.course_id = c.id
      LEFT JOIN lessons l
        ON l.section_id = s.id

      WHERE c.id = $1 AND l.status IN ('public', 'preview')

      ORDER BY s.order ASC, l.order ASC;
    `,
    [courseId]
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

  const sectionMap = new Map<string, Section & { lessons: Lesson[] }>();

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
      } as Lesson);
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
  const course = await getCourse(courseId);
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
  const course = await getCourse(courseId);
  if (!course) notFound();

  console.log(course.sections)

  const totalLessons = course.sections?.reduce(
    (acc, section) => acc + section.lessons.length,
    0,
  );
  const totalSections = course.sections.length

  return (
    <div className="w-full max-w-5xl mx-auto pb-28">
      <section className="relative w-full h-72 md:h-100 rounded-2xl overflow-hidden mb-8 mx-0">
        <Image
          src={"/images/null"}
          alt={course.name}
          fill
          priority
          className="object-cover"
          referrerPolicy="no-referrer"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-5 pb-6">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-2">
            {course.name}
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#929277] ml-1">1.2k students</span>
            </div>
            <span className="text-[#929277] text-xs">•</span>
            <span className="text-xs text-[#929277]">
              {formatString({
                number: Number(course.sections?.length),
                plural: "Sections",
                singular: "Section",
              })}
            </span>
          </div>
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