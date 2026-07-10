import SectionForm from "@/components/admin/SectionForm";
import { db } from "@/database/db";
import { FolderOpen, Plus } from "lucide-react";
import SortableSectionList from "@/components/admin/SortableSectionList";

interface CourseDetails extends Course {
  sections: (Section & { lessons: Lesson[] })[];
}

const getCourseSectionsLessons = async (courseId: string) => {
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
        l.duration AS lesson_duration
      FROM courses c
      LEFT JOIN sections s
        ON c.id = s.course_id
      LEFT JOIN lessons l
        ON s.id = l.section_id
      WHERE c.id = $1
      ORDER BY s.order ASC, l.order ASC`,
    [courseId],
  );

  const firstRow = result.rows[0];

  const course = {
    id: firstRow.course_id,
    name: firstRow.course_name,
    description: firstRow.course_description,
    updated_at: firstRow.updated_at,
    sections: [],
  } as CourseDetails;

  const sectionMap = new Map();

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

    if (row.lesson_id) {
      sectionMap.get(row.section_id)?.lessons.push({
        id: row.lesson_id,
        name: row.lesson_name,
        description: row.lesson_description,
        youtubeVideoId: row.lesson_youtube_video_id,
        status: row.lesson_status,
        order: row.lesson_order,
        duration: Number(row.lesson_duration || 0),
      });
    }
  }

  return course;
};

async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const courseId = (await params).courseId;
  const course = await getCourseSectionsLessons(courseId);

  return (
    <>
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-6 rounded-2xl border border-[#252525] shadow-lg space-y-6 w-full mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#252525] pb-4 gap-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-brand-yellow" />
            <div>
              <span className="text-[9px] text-brand-yellow font-bold font-mono tracking-widest block">
                CURRICULUM TREE
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {course.name}
              </h3>
            </div>
          </div>

          <SectionForm
            type="create"
            courseName={course.name}
            courseId={courseId}
            nextSectionOrder={course.sections.length + 1}
          >
            <button className="bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-bold py-2 px-4 rounded-xl hover:bg-brand-yellow/20 transition-all flex items-center gap-1 uppercase tracking-wider cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>New Section</span>
            </button>
          </SectionForm>
        </div>

        <SortableSectionList course={course} sections={course.sections} />
      </div>
    </>
  );
}

export default EditCoursePage;
