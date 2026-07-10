import { db } from "@/database/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, lessonId, currentTime, watchedSeconds, completed } = await req.json()

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
            progress_seconds =
            CASE
              WHEN EXCLUDED.progress_seconds < user_lesson_progress.progress_seconds
                  AND user_lesson_progress.progress_seconds - EXCLUDED.progress_seconds > 30
              THEN EXCLUDED.progress_seconds
              ELSE GREATEST(
                user_lesson_progress.progress_seconds,
                EXCLUDED.progress_seconds
            )
            END,
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

    return new Response("Progress saved successfully", { status: 200 });
  } catch (err) {
    console.error("Error saving progress:", err);
    return new Response("Error saving progress", { status: 400 });
  }
}
