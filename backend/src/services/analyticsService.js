const pool = require('../config/database')

/**
 * Calculate estimated 1RM using Epley formula
 * Formula: weight × (1 + reps / 30)
 * @param {number} weight - Weight lifted
 * @param {number} reps - Number of repetitions
 * @returns {number} Estimated 1RM
 */
function calculateEstimated1RM(weight, reps) {
  if (reps === 1) {
    return weight
  }
  // Epley formula is most accurate for 1-10 reps
  return Math.round(weight * (1 + reps / 30))
}

/**
 * Calculate estimated 1RM using Brzycki formula (alternative)
 * Formula: weight × (36 / (37 - reps))
 * @param {number} weight - Weight lifted
 * @param {number} reps - Number of repetitions
 * @returns {number} Estimated 1RM
 */
function calculateEstimated1RMBrzycki(weight, reps) {
  if (reps === 1) {
    return weight
  }
  if (reps >= 37) {
    return weight // Formula breaks down at high reps
  }
  return Math.round(weight * (36 / (37 - reps)))
}

/**
 * Detect if a set is a new Personal Record
 * @param {number} userId - User ID
 * @param {string} exerciseName - Exercise name
 * @param {number} weight - Weight lifted
 * @param {number} reps - Number of repetitions
 * @returns {Promise<Object>} PR information (isNewPR, prType, previousBest, newRecord)
 */
async function detectPersonalRecord(userId, exerciseName, weight, reps) {
  try {
    // Get existing PR for this rep range (e.g., 1RM, 3RM, 5RM)
    const existingPR = await pool.query(
      `SELECT * FROM personal_records
       WHERE user_id = $1 AND exercise_name = $2 AND rep_range = $3
       ORDER BY weight DESC LIMIT 1`,
      [userId, exerciseName, reps]
    )

    // Calculate estimated 1RM for comparison
    const estimated1RM = calculateEstimated1RM(weight, reps)

    // Get best estimated 1RM for this exercise
    const best1RM = await pool.query(
      `SELECT * FROM personal_records
       WHERE user_id = $1 AND exercise_name = $2
       ORDER BY estimated_1rm DESC LIMIT 1`,
      [userId, exerciseName]
    )

    const result = {
      isNewPR: false,
      prType: null,
      previousBest: null,
      newRecord: {
        exerciseName,
        weight,
        reps,
        estimated1RM,
        date: new Date(),
      },
    }

    // Check if this is a new PR for the specific rep range
    if (!existingPR.rows[0] || weight > existingPR.rows[0].weight) {
      result.isNewPR = true
      result.prType = `${reps}RM`
      result.previousBest = existingPR.rows[0] || null
    }

    // Also check if this is a new estimated 1RM PR
    if (!best1RM.rows[0] || estimated1RM > best1RM.rows[0].estimated_1rm) {
      result.isNewPR = true
      result.prType = result.prType ? `${result.prType}, e1RM` : 'e1RM'
    }

    return result
  } catch (error) {
    console.error('Error detecting PR:', error)
    throw error
  }
}

/**
 * Save a new Personal Record to the database
 * @param {number} userId - User ID
 * @param {string} exerciseName - Exercise name
 * @param {number} weight - Weight lifted
 * @param {number} reps - Number of repetitions
 * @param {Date} date - Date of the PR
 * @returns {Promise<Object>} Saved PR record
 */
async function savePersonalRecord(
  userId,
  exerciseName,
  weight,
  reps,
  date = new Date()
) {
  const estimated1RM = calculateEstimated1RM(weight, reps)

  try {
    const result = await pool.query(
      `INSERT INTO personal_records
       (user_id, exercise_name, weight, rep_range, estimated_1rm, achieved_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, exerciseName, weight, reps, estimated1RM, date]
    )

    return result.rows[0]
  } catch (error) {
    console.error('Error saving PR:', error)
    throw error
  }
}

/**
 * Get all Personal Records for a user
 * @param {number} userId - User ID
 * @param {string} exerciseName - Optional: filter by exercise name
 * @returns {Promise<Array>} Array of PR records
 */
async function getPersonalRecords(userId, exerciseName = null) {
  try {
    let query
    let params

    if (exerciseName) {
      query = `
        SELECT * FROM personal_records
        WHERE user_id = $1 AND exercise_name = $2
        ORDER BY achieved_date DESC
      `
      params = [userId, exerciseName]
    } else {
      query = `
        SELECT DISTINCT ON (exercise_name, rep_range) *
        FROM personal_records
        WHERE user_id = $1
        ORDER BY exercise_name, rep_range, weight DESC, achieved_date DESC
      `
      params = [userId]
    }

    const result = await pool.query(query, params)
    return result.rows
  } catch (error) {
    console.error('Error getting PRs:', error)
    throw error
  }
}

/**
 * Get exercise history (all logged sets) for a specific exercise
 * @param {number} userId - User ID
 * @param {string} exerciseName - Exercise name
 * @param {number} limit - Optional: limit number of results
 * @returns {Promise<Array>} Array of workout logs with the exercise
 */
async function getExerciseHistory(userId, exerciseName, limit = 50) {
  try {
    // Since exercises are stored as JSON in workout_logs, we need to query differently
    const result = await pool.query(
      `SELECT id, session_id, date, exercises
       FROM workout_logs
       WHERE user_id = $1
       AND exercises::text LIKE $2
       ORDER BY date DESC
       LIMIT $3`,
      [userId, `%${exerciseName}%`, limit]
    )

    // Parse and filter the results
    const history = result.rows
      .map((log) => {
        const exercises =
          typeof log.exercises === 'string'
            ? JSON.parse(log.exercises)
            : log.exercises

        const exercise = exercises.find((ex) => ex.name === exerciseName)

        if (exercise) {
          return {
            date: log.date,
            sessionId: log.session_id,
            ...exercise,
            // Calculate max estimated 1RM for this session
            maxEstimated1RM: Math.max(
              ...exercise.sets.map((set) =>
                calculateEstimated1RM(set.weight, set.reps)
              )
            ),
          }
        }
        return null
      })
      .filter((item) => item !== null)

    return history
  } catch (error) {
    console.error('Error getting exercise history:', error)
    throw error
  }
}

/**
 * Get progress analytics for an exercise over time
 * @param {number} userId - User ID
 * @param {string} exerciseName - Exercise name
 * @param {number} days - Number of days to look back (default: 90)
 * @returns {Promise<Object>} Progress analytics
 */
async function getProgressAnalytics(userId, exerciseName, days = 90) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const history = await getExerciseHistory(userId, exerciseName, 100)

    // Filter by date range
    const recentHistory = history.filter(
      (item) => new Date(item.date) >= cutoffDate
    )

    if (recentHistory.length === 0) {
      return {
        exerciseName,
        period: `${days} days`,
        dataPoints: 0,
        trend: null,
        chartData: [],
      }
    }

    // Calculate trend (comparing first half to second half of period)
    const midpoint = Math.floor(recentHistory.length / 2)
    const firstHalf = recentHistory.slice(midpoint)
    const secondHalf = recentHistory.slice(0, midpoint)

    const avgFirst =
      firstHalf.reduce((sum, item) => sum + item.maxEstimated1RM, 0) /
      firstHalf.length
    const avgSecond =
      secondHalf.reduce((sum, item) => sum + item.maxEstimated1RM, 0) /
      secondHalf.length

    const percentChange = ((avgSecond - avgFirst) / avgFirst) * 100

    return {
      exerciseName,
      period: `${days} days`,
      dataPoints: recentHistory.length,
      averageEstimated1RM: {
        first: Math.round(avgFirst),
        recent: Math.round(avgSecond),
      },
      percentChange: Math.round(percentChange * 10) / 10,
      trend:
        percentChange > 5
          ? 'improving'
          : percentChange < -5
            ? 'declining'
            : 'stable',
      chartData: recentHistory.reverse().map((item) => ({
        date: item.date,
        estimated1RM: item.maxEstimated1RM,
      })),
    }
  } catch (error) {
    console.error('Error getting progress analytics:', error)
    throw error
  }
}

module.exports = {
  calculateEstimated1RM,
  calculateEstimated1RMBrzycki,
  detectPersonalRecord,
  savePersonalRecord,
  getPersonalRecords,
  getExerciseHistory,
  getProgressAnalytics,
}
