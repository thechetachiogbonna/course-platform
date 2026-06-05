CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_video_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'private' CHECK (status IN ('public', 'private', 'preview')),
  section_id UUID NOT NULL,
  "order" INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_course_section_lesson
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);