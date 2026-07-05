ALTER TABLE user_lesson_progress DROP COLUMN progress;

ALTER TABLE user_lesson_progress
    ADD COLUMN progress_seconds INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE;
