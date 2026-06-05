CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status TEXT NOT NULL DEFAULT 'private' CHECK (status IN ('public', 'private')),
  course_id UUID NOT NULL,
  "order" INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_course_section_course
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);