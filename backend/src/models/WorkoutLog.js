const pool = require('../config/database')

async function createWorkoutLog(userId, workoutData) {
  const { sessionId, exercises, date, notes, substitutions } = workoutData
  // This is a simplified version. In a real app, you would probably have a more normalized schema.
  const res = await pool.query(
    `INSERT INTO workout_logs
     (user_id, session_id, exercises, date, notes, substitutions)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      userId,
      sessionId,
      JSON.stringify(exercises),
      date || new Date(),
      notes || null,
      substitutions ? JSON.stringify(substitutions) : null,
    ]
  )
  return res.rows[0]
}

async function getWorkoutLogs(userId, startDate = null, endDate = null) {
  let query = 'SELECT * FROM workout_logs WHERE user_id = $1'
  const params = [userId]

  if (startDate) {
    params.push(startDate)
    query += ` AND date >= $${params.length}`
  }

  if (endDate) {
    params.push(endDate)
    query += ` AND date <= $${params.length}`
  }

  query += ' ORDER BY date DESC'

  const res = await pool.query(query, params)
  return res.rows
}

async function getWorkoutLogById(userId, logId) {
  const res = await pool.query(
    'SELECT * FROM workout_logs WHERE user_id = $1 AND id = $2',
    [userId, logId]
  )
  return res.rows[0]
}

module.exports = {
  createWorkoutLog,
  getWorkoutLogs,
  getWorkoutLogById,
}
