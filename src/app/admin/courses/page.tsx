import CourseForm from "@/components/admin/CourseForm";
import CoursesTable from "@/components/admin/CoursesTable";
import { db } from "@/database/db";

const getCourses = async () => {
  const courses = await db.query(
    `
      SELECT
        c.*,
        COUNT(DISTINCT s.id) AS section_count,
        COUNT(DISTINCT l.id) AS lesson_count
      FROM courses c
      LEFT JOIN sections s
      ON c.id = s.course_id
      LEFT JOIN lessons l
      ON s.id = l.section_id
      GROUP BY c.id
      ORDER BY c.created_at DESC;
    `,
  );

  return courses.rows;
};

export default async function CoursesPage() {
  const courses = await getCourses();

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

      {/* Courses Table with integrated search and pagination */}
      <CoursesTable courses={courses} />
    </div>
  );
}
