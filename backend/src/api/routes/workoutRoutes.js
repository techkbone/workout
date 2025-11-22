const express = require('express')
const router = express.Router()
const { getTodaysWorkout } = require('../../services/programService')
const { createWorkoutLog } = require('../../models/WorkoutLog')
const { basicAuth } = require('../middleware/auth')

router.get('/today', basicAuth, async (req, res, next) => {
  try {
    const workout = await getTodaysWorkout(new Date())
    res.json(workout)
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

module.exports = router
