-- Database Schema for Workout Tracker
-- This file should be run after database creation to set up tables and indexes

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout Logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  exercises JSONB NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  substitutions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal Records table
CREATE TABLE IF NOT EXISTS personal_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_name VARCHAR(255) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  rep_range INTEGER NOT NULL,
  estimated_1rm DECIMAL(10, 2) NOT NULL,
  achieved_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization

-- Workout logs indexes
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON workout_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs(user_id, date DESC);

-- Personal records indexes
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise ON personal_records(exercise_name);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_exercise ON personal_records(user_id, exercise_name);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_date ON personal_records(user_id, achieved_date DESC);

-- GIN index for JSONB exercise data (allows fast queries within JSON)
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercises_gin ON workout_logs USING GIN (exercises);

-- Comments for documentation
COMMENT ON TABLE workout_logs IS 'Stores completed workout sessions with exercise data in JSONB format';
COMMENT ON TABLE personal_records IS 'Tracks personal records for each exercise per user';
COMMENT ON COLUMN workout_logs.exercises IS 'JSONB array of exercises with sets, reps, and weights';
COMMENT ON COLUMN workout_logs.substitutions IS 'JSONB object tracking exercise substitutions made during workout';
COMMENT ON COLUMN personal_records.estimated_1rm IS 'Calculated 1-rep max using Epley or Brzycki formula';
