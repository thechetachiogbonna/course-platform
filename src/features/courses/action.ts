"use server";

import { db } from "@/database/db";
import { revalidatePath } from "next/cache";
import { PoolClient } from "pg";

export const createCourse = async (courseData: Partial<Course>) => {
  try {
    const result = await db.query(
      "INSERT INTO courses (name, description) VALUES ($1, $2) RETURNING *",
      [courseData.name, courseData.description],
    );

    revalidatePath("/admin/courses");
    revalidatePath("/admin");

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

export const deleteCourse = async (courseId: string) => {
  try {
    await db.query("DELETE FROM courses WHERE id = $1", [courseId]);

    revalidatePath("/admin/courses");
    revalidatePath("/admin");

    return {
      error: false,
      message: "Course deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to delete course",
    };
  }
};

export const userCanAccessCourse = async (userId: string, courseId: string) => {
  try {
    const result = await db.query(
      `
      SELECT 
        *
      FROM user_course_access
      WHERE user_id = $1 AND course_id = $2
    `,
      [userId, courseId],
    );

    return result.rows.length > 0;
  } catch (error) {
    console.log("Error fetching user course access", error);
    return false;
  }
};

export const addUserCourseAccess = async (
  {
    userId,
    courseIds,
  }: {
    userId: string;
    courseIds: string[];
  },
  trx: PoolClient,
) => {
  try {
    for (const courseId of courseIds) {
      await trx.query(
        "INSERT INTO user_course_access (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING",
        [userId, courseId],
      );
    }

    return {
      error: false,
      message: "User course access added successfully",
    };
  } catch (error) {
    console.error("Error adding user course access:", error);
    return {
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "Failed to add user course access",
    };
  }
};
