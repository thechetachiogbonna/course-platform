import LearningHeatmap from "@/components/user/LearningHeatmap";
import MyCoursesList from "@/components/user/MyCoursesList";
import { db } from "@/database/db";
import { getCurrentUser } from "@/features/users/action";
import { formatDate, getCurrentStreak } from "@/lib/utils";

const getMyCourses = async (userId: string) => {
  const result = await db.query(
    `
      SELECT 
        c.id as course_id,
        c.name as course_name,
        c.description as course_description,
        ROUND((
          COALESCE(SUM(ulp.progress_seconds), 0)::numeric 
          / NULLIF(SUM(l.duration), 0)
          ) * 100) AS progress_percent
      FROM user_course_access AS uca
      INNER JOIN courses c
        ON uca.course_id = c.id
      INNER JOIN sections s
        ON s.course_id = c.id
      INNER JOIN lessons l
        ON l.section_id = s.id
      LEFT JOIN user_lesson_progress ulp
        ON ulp.lesson_id = l.id
      AND ulp.user_id = uca.user_id
      WHERE uca.user_id = $1
      GROUP BY c.id;
    `,
    [userId],
  );

  return result.rows.map((row) => ({
    courseId: row.course_id,
    courseName: row.course_name,
    courseDescription: row.course_description,
    progressPercent: row.progress_percent,
  }));
};

const getUserDailyActivity = async (userId: string) => {
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

  return result.rows.map((row) => ({
    date: formatDate(new Date(row.activity_date)),
    secondsWatched: row.seconds_watched,
  })) as ActivityDay[];
};

export default async function CoursesPage() {
  const { user } = await getCurrentUser();

  const [coursesResult, activityResult] = await Promise.allSettled([
    getMyCourses(user.id),
    getUserDailyActivity(user.id),
  ]);

  const courses =
    coursesResult.status === "fulfilled" ? coursesResult.value : [];

  const activity =
    activityResult.status === "fulfilled" ? activityResult.value : [];

  return (
    <div className="w-full relative min-h-screen">
      <MyCoursesList courses={courses} />

      <LearningHeatmap
        activity={activity}
        currentStreak={getCurrentStreak(activity.map((day) => day.date))}
      />
    </div>
  );
}
