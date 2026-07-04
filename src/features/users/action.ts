"use server";

import { db } from "@/database/db";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const createUser = async (userData: User) => {
  try {
    const result = await db.query(
      "INSERT INTO users (clerk_user_id, name, email, role, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        userData.clerk_user_id,
        userData.name,
        userData.email,
        userData.role,
        userData.image_url,
      ],
    );

    return {
      error: false,
      message: "User created successfully",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to create user",
    };
  }
};

export const updateUser = async (
  clerkUserId: string,
  updateData: Partial<User>,
) => {
  try {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2, image_url = $3, role = $4, updated_at = $5 WHERE clerk_user_id = $6   RETURNING *",
      [
        updateData.name,
        updateData.email,
        updateData.image_url,
        updateData.role,
        new Date(),
        clerkUserId,
      ],
    );

    return {
      error: false,
      message: "User updated successfully",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to update user",
    };
  }
};

export const deleteUser = async (clerkUserId: string) => {
  try {
    await db.query(
      "UPDATE users SET name = $1, email = $2, image_url = $3, deleted_at = $4 WHERE clerk_user_id = $5 RETURNING *",
      [
        "Deleted User",
        "deleted@example.com",
        "https://via.placeholder.com/150?text=Deleted+User",
        new Date(),
        clerkUserId,
      ],
    );
    return {
      error: false,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
};

export const syncDBUserToClerk = async ({
  userId,
  role,
  clerkUserId,
}: {
  userId: string;
  role: "admin" | "user";
  clerkUserId: string;
}) => {
  const client = await clerkClient();

  await client.users.updateUser(clerkUserId, {
    publicMetadata: {
      dbId: userId,
      role: role || "user",
    },
  });
};

export async function getCurrentUser() {
  const { userId, sessionClaims: _, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  const user = await getUser(userId)

  return {
    user
  }
}

async function getUser(clerkUserId: string) {
  const result = await db.query(
    "SELECT * FROM users WHERE clerk_user_id = $1",
    [clerkUserId],
  )

  return result.rows[0] as User
}