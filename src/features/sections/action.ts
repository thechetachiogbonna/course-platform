"use server";

import { db } from "@/database/db";

export const createSection = async (sectionData: Omit<Section, "id">) => {
  try {
    const result = await db.query(
      `INSERT INTO sections (course_id, name, status, "order") VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        sectionData.courseId,
        sectionData.name,
        sectionData.status,
        sectionData.order,
      ],
    );

    return {
      error: false,
      message: "Section created successfully",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error creating section:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to create section",
    };
  }
};
