CREATE TABLE user_daily_activity (
  user_id UUID NOT NULL,
  activity_date DATE NOT NULL,
  seconds_watched INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY(user_id, activity_date),

  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);