CREATE TABLE user_lesson_progress (
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id),
  CONSTRAINT fk_user_lesson_progress_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_lesson_progress_lesson
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);