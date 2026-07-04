"use server";

import { db } from "@/database/db";
import { PoolClient } from "pg";

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

export const addUserCourseAccess = async ({
  userId,
  courseIds,
}: {
  userId: string;
  courseIds: string[];
}, trx: PoolClient) => {
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
