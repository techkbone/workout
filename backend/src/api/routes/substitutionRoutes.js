const express = require('express')
const router = express.Router()
const {
  getExerciseInfo,
  getAlternatives,
  getExercisesByCategory,
  getAllCategories,
  validateSubstitution,
} = require('../../services/substitutionService')
const { basicAuth } = require('../middleware/auth')

/**
 * GET /api/substitutions/alternatives/:exerciseName
 * Get alternative exercises for a specific exercise
 */
router.get('/alternatives/:exerciseName', basicAuth, async (req, res, next) => {
  try {
    const { exerciseName } = req.params
    const { reason } = req.query

    const exerciseInfo = getExerciseInfo(exerciseName)
    if (!exerciseInfo) {
      return res.status(404).json({
        error: 'Exercise not found',
        exerciseName,
      })
    }

    const alternatives = getAlternatives(exerciseName, reason)

    res.json({
      exerciseName,
      category: exerciseInfo.category,
      type: exerciseInfo.type,
      alternatives,
      reason: reason || null,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/substitutions/categories
 * Get all exercise categories
 */
router.get('/categories', basicAuth, async (req, res, next) => {
  try {
    const categories = getAllCategories()
    res.json(categories)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/substitutions/category/:categoryName
 * Get exercises by category
 */
router.get('/category/:categoryName', basicAuth, async (req, res, next) => {
  try {
    const { categoryName } = req.params
    const exercises = getExercisesByCategory(categoryName)
    res.json({
      category: categoryName,
      exercises,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/substitutions/validate
 * Validate a proposed substitution
 */
router.post('/validate', basicAuth, async (req, res, next) => {
  try {
    const { originalExercise, substituteExercise } = req.body

    if (!originalExercise || !substituteExercise) {
      return res.status(400).json({
        error: 'Both originalExercise and substituteExercise are required',
      })
    }

    const validation = validateSubstitution(
      originalExercise,
      substituteExercise
    )
    res.json(validation)
  } catch (error) {
    next(error)
  }
})

module.exports = router
