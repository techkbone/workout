const pool = require('../config/database')

async function createWorkoutLog(userId, workoutData) {
  const { sessionId, exercises } = workoutData
  // This is a simplified version. In a real app, you would probably have a more normalized schema.
  const res = await pool.query(
    'INSERT INTO workout_logs (user_id, session_id, exercises) VALUES ($1, $2, $3) RETURNING *',
    [userId, sessionId, JSON.stringify(exercises)]
  )
  return res.rows[0]
}

module.exports = {
  createWorkoutLog,
}
