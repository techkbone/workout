const pool = require('../config/database')

async function getPersonalRecords(userId, exerciseName) {
  // This is a placeholder. The actual implementation would be more complex.
  const res = await pool.query(
    'SELECT * FROM personal_records WHERE user_id = $1 AND exercise_name = $2 ORDER BY weight DESC, reps DESC LIMIT 1',
    [userId, exerciseName]
  )
  return res.rows[0]
}

module.exports = {
  getPersonalRecords,
}
