"use server";

import { db } from "@/database/db";
import { revalidatePath } from "next/cache";

export const createLesson = async (lessonData: Omit<Lesson, "id">) => {
  try {
    const result = await db.query(
      `INSERT INTO lessons (name, description, status, "order", youtube_video_id, section_id, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        lessonData.name,
        lessonData.description,
        lessonData.status,
        lessonData.order,
        lessonData.youtubeVideoId,
        lessonData.sectionId,
        lessonData.duration,
      ],
    );

    const sectionResult = await db.query(
      `SELECT course_id FROM sections WHERE id = $1`,
      [lessonData.sectionId],
    );
    const courseId = sectionResult.rows[0]?.course_id;
    if (courseId) {
      revalidatePath(`/admin/courses/${courseId}/edit`);
    }

    return {
      error: false,
      message: "Lesson created successfully",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error creating lesson:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to create lesson",
    };
  }
};

export const updateLesson = async (
  lessonId: string,
  lessonData: Omit<Lesson, "id">,
) => {
  try {
    const sectionResult = await db.query(
      `SELECT s.course_id FROM sections s JOIN lessons l ON s.id = l.section_id WHERE l.id = $1`,
      [lessonId],
    );
    const courseId = sectionResult.rows[0]?.course_id;

    await db.query(
      `UPDATE lessons SET name = $1, description = $2, status = $3, "order" = $4, youtube_video_id = $5, section_id = $6, duration = $7 WHERE id = $8`,
      [
        lessonData.name,
        lessonData.description,
        lessonData.status,
        lessonData.order,
        lessonData.youtubeVideoId,
        lessonData.sectionId,
        lessonData.duration,
        lessonId,
      ],
    );

    if (courseId) {
      revalidatePath(`/admin/courses/${courseId}/edit`);
    }

    return {
      error: false,
      message: "Lesson updated successfully",
    };
  } catch (error) {
    console.error("Error updating lesson:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to update lesson",
    };
  }
};

export const deleteLesson = async (lessonId: string) => {
  try {
    const sectionResult = await db.query(
      `SELECT s.course_id FROM sections s JOIN lessons l ON s.id = l.section_id WHERE l.id = $1`,
      [lessonId],
    );
    const courseId = sectionResult.rows[0]?.course_id;

    await db.query(`DELETE FROM lessons WHERE id = $1`, [lessonId]);

    if (courseId) {
      revalidatePath(`/admin/courses/${courseId}/edit`);
    }

    return {
      error: false,
      message: "Lesson deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to delete lesson",
    };
  }
};

export const updateLessonOrder = async (lessonIds: string[]) => {
  try {
    await db.query(
      `
        UPDATE lessons
        SET "order" = i.idx::int
        FROM (
          SELECT id, idx
          FROM unnest($1::uuid[]) WITH ORDINALITY AS t(id, idx)
        ) i
        WHERE lessons.id = i.id;
      `,
      [lessonIds],
    );

    return {
      error: false,
      message: "Lesson order changed successfully",
    };
  } catch (error) {
    console.error("Error changing lesson order:", error);
    return {
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "Failed to change lesson order",
    };
  }
};

export const updateLessonProgress = async (
  userId: string,
  lessonId: string,
  currentTime: number,
  watchedSeconds: number,
  completed: boolean
) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO user_lesson_progress (
        user_id,
        lesson_id,
        progress_seconds,
        completed
      )
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE
      SET
        progress_seconds = GREATEST(
          user_lesson_progress.progress_seconds,
          EXCLUDED.progress_seconds
        ),
        completed = $4,
        updated_at = NOW()
      `,
      [userId, lessonId, currentTime, completed]
    );

    await client.query(
      `
      INSERT INTO user_daily_activity (
        user_id,
        activity_date,
        seconds_watched
      )
      VALUES (
        $1,
        CURRENT_DATE,
        $2
      )
      ON CONFLICT (user_id, activity_date)
      DO UPDATE
      SET
        seconds_watched =
          user_daily_activity.seconds_watched +
          EXCLUDED.seconds_watched,
        updated_at = NOW()
      `,
      [userId, watchedSeconds]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
