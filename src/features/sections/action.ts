"use server";

import { db } from "@/database/db";
import { revalidatePath } from "next/cache";

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

    revalidatePath(`/admin/courses/${sectionData.courseId}/edit`);

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

export const updateSection = async (
  sectionId: string,
  sectionData: Pick<Section, "name" | "status" | "order">
) => {
  try {
    await db.query(
      `UPDATE sections SET name = $1, status = $2, "order" = $3 WHERE id = $4`,
      [sectionData.name, sectionData.status, sectionData.order, sectionId]
    );

    return {
      error: false,
      message: "Section updated successfully"
    };
  } catch (error) {
    console.error("Error updating section:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to update section",
    };
  }
};

export const deleteSection = async (sectionId: string) => {
  try {
    await db.query(`DELETE FROM sections WHERE id = $1`, [sectionId]);

    return {
      error: false,
      message: "Section deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting section:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to delete section",
    };
  }
};
