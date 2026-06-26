"use server";

import { db } from "@/database/db";

export const createCourse = async (courseData: Partial<Course>) => {
  try {
    const result = await db.query(
      "INSERT INTO courses (name, description) VALUES ($1, $2) RETURNING *",
      [courseData.name, courseData.description],
    );

    return {
      error: false,
      message: "Course created successfully",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to create course",
    };
  }
};