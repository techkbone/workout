const express = require('express')
const router = express.Router()
const {
  getTodaysWorkout,
  getAllPlannedWorkouts,
} = require('../../services/programService')
const {
  createWorkoutLog,
  getWorkoutLogs,
  getWorkoutLogById,
} = require('../../models/WorkoutLog')
const { basicAuth } = require('../middleware/auth')

router.get('/today', basicAuth, async (req, res, next) => {
  try {
    const { date } = req.query
    const workout = await getTodaysWorkout(date ? new Date(date) : new Date())
    res.json(workout)
  } catch (error) {
    next(error)
  }
})

router.get('/planned', basicAuth, async (req, res, next) => {
  try {
    const plannedWorkouts = await getAllPlannedWorkouts()
    res.json(plannedWorkouts)
  } catch (error) {
    next(error)
  }
})

router.post('/log', basicAuth, async (req, res, next) => {
  try {
    const log = await createWorkoutLog(req.userId, req.body)
    res.status(201).json(log)
  } catch (error) {
    next(error)
  }
})

router.get('/logs', basicAuth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query
    const logs = await getWorkoutLogs(
      req.userId,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    )
    res.json(logs)
  } catch (error) {
    next(error)
  }
})

router.get('/logs/:logId', basicAuth, async (req, res, next) => {
  try {
    const { logId } = req.params
    const log = await getWorkoutLogById(req.userId, logId)
    if (!log) {
      return res.status(404).json({ error: 'Workout log not found' })
    }
    res.json(log)
  } catch (error) {
    next(error)
  }
})

module.exports = router
