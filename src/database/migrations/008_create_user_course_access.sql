CREATE TABLE user_course_access (
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id),
  CONSTRAINT fk_user_course_access_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_course_access_course
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);