const express = require('express')
const router = express.Router()
const {
  getPersonalRecords,
  getExerciseHistory,
  getProgressAnalytics,
} = require('../../services/analyticsService')
const { basicAuth } = require('../middleware/auth')

/**
 * GET /api/analytics/prs
 * Get all Personal Records for the authenticated user
 * Query params:
 *   - exercise: (optional) filter by exercise name
 */
router.get('/prs', basicAuth, async (req, res, next) => {
  try {
    const { exercise } = req.query
    const prs = await getPersonalRecords(req.userId, exercise || null)
    res.json(prs)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/analytics/exercise-history/:exerciseName
 * Get workout history for a specific exercise
 * Query params:
 *   - limit: (optional) number of records to return (default: 50)
 */
router.get(
  '/exercise-history/:exerciseName',
  basicAuth,
  async (req, res, next) => {
    try {
      const { exerciseName } = req.params
      const { limit } = req.query
      const history = await getExerciseHistory(
        req.userId,
        exerciseName,
        limit ? parseInt(limit) : 50
      )
      res.json(history)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * GET /api/analytics/progress/:exerciseName
 * Get progress analytics for a specific exercise
 * Query params:
 *   - days: (optional) number of days to analyze (default: 90)
 */
router.get('/progress/:exerciseName', basicAuth, async (req, res, next) => {
  try {
    const { exerciseName } = req.params
    const { days } = req.query
    const analytics = await getProgressAnalytics(
      req.userId,
      exerciseName,
      days ? parseInt(days) : 90
    )
    res.json(analytics)
  } catch (error) {
    next(error)
  }
})

module.exports = router
