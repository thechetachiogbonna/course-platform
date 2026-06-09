import LessonForm from "@/components/admin/LessonForm";
import SectionForm from "@/components/admin/SectionForm";
import { db } from "@/database/db";
import { FolderOpen, PlaySquare, Plus } from "lucide-react";

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
        l.youtube_video_id
      FROM courses c
      LEFT JOIN sections s
        ON c.id = s.course_id
      LEFT JOIN lessons l
        ON s.id = l.section_id
      WHERE c.id = $1
      ORDER BY s.created_at, l.created_at
    `,
    [courseId],
  );

  const firstRow = result.rows[0];

  const course = {
    id: firstRow.course_id,
    name: firstRow.course_name,
    description: firstRow.course_description,
    updated_at: firstRow.updated_at,
    sections: [],
  } as CourseDetails

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
            <FolderOpen className="w-5 h-5 text-[#e2ec00]" />
            <div>
              <span className="text-[9px] text-[#e2ec00] font-bold font-mono tracking-widest block">
                CURRICULUM TREE
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {course.name}
              </h3>
            </div>
          </div>

          <SectionForm courseName={course.name} courseId={courseId} />
        </div>

        {course.sections.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-mono">
            Syllabus structure empty. Click "Add Section" to compile curriculum
            blocks.
          </div>
        ) : (
          <div className="space-y-4">
            {course.sections.map((section, idx) => {
              return (
                <div
                  key={section.id}
                  className="border border-[#252525] bg-[#111]/40 rounded-xl overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-[#1e1e1e]/60 p-4 flex items-center justify-between border-b border-[#252525]/40 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] text-[#c9c8ab] font-mono">
                        SECTION #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {section.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-white/5 border border-white/10 text-[#c9c8ab] px-2 py-0.5 rounded font-mono uppercase">
                        {section.status}
                      </span>

                      <LessonForm
                        sectionName={section.name}
                        sectionId={section.id}
                      >
                        <div 
                          className="cursor-pointer text-[#e2ec00] hover:text-white border border-[#e2ec00]/20 hover:border-[#e2ec00] text-[10px] font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Lesson</span>
                        </div>
                      </LessonForm>
                    </div>
                  </div>

                  {/* Section Lessons */}
                  <div className="divide-y divide-[#252525]/20">
                    {section.lessons.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-500 italic">
                        No lessons recorded in this section module. Press "Add
                        Lesson" to populate clips.
                      </div>
                    ) : (
                      section.lessons.map((lesson) => (
                        <LessonForm
                          key={lesson.id}
                          sectionName={section.name}
                          sectionId={section.id}
                        >
                          <div className="w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="p-2 rounded-lg bg-[#e2ec00]/10 text-[#e2ec00] shrink-0 mt-0.5">
                              <PlaySquare className="w-4 h-4" />
                            </div>
                            <div className="grow min-w-0">
                              <div className="flex items-start gap-2 justify-between">
                                <div className="flex flex-col justify-center items-start">
                                  <h5 className="text-xs font-bold text-white truncate">
                                    {lesson.name}
                                  </h5>

                                  <p className="text-[11px] text-[#c9c8ab] mt-1 lead-relaxed line-clamp-2">
                                    {lesson.description}
                                  </p>
                                  {lesson.youtubeVideoId && (
                                    <span className="text-[9px] text-[#e2ec00]/60 font-mono mt-1 block">
                                      Tip: Click a lesson to edit
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-[#c9c8ab]/60 font-mono">
                                    Order: {lesson.order}
                                  </span>
                                  <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded font-bold uppercase text-[#e2ec00]">
                                    {lesson.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </LessonForm>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default EditCoursePage;
