CREATE TABLE user_lesson_complete (
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id),
  CONSTRAINT fk_user_lesson_complete_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_lesson_complete_lesson
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);