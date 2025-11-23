const express = require('express')
const router = express.Router()

const workoutRoutes = require('./workoutRoutes')
const analyticsRoutes = require('./analyticsRoutes')
const substitutionRoutes = require('./substitutionRoutes')

router.use('/workouts', workoutRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/substitutions', substitutionRoutes)

router.get('/', (req, res) => {
  res.send('API is running')
})

module.exports = router
