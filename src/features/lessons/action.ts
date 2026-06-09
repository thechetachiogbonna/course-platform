"use server";

import { db } from "@/database/db";

export const createLesson = async (lessonData: Omit<Lesson, "id">) => {
  try {
    const result = await db.query(
      `INSERT INTO lessons (name, description, status, "order", youtube_video_id, section_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        lessonData.name,
        lessonData.description,
        lessonData.status,
        lessonData.order,
        lessonData.youtubeVideoId,
        lessonData.sectionId,
      ],
    );

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
