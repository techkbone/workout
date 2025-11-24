import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Skeleton
} from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import {
  getTodaysWorkout,
  getWorkoutLogs,
  getPlannedWorkouts,
} from '../services/apiClient'
import WorkoutCalendar from '../components/WorkoutCalendar'
import ExerciseSubstitutionModal from '../components/ExerciseSubstitutionModal'
import { glassmorphism } from '../theme/customTheme'

function Plan() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [workout, setWorkout] = useState(null)
  const [workoutLogs, setWorkoutLogs] = useState([])
  const [plannedWorkouts, setPlannedWorkouts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [substitutionModal, setSubstitutionModal] = useState({
    open: false,
    exercise: null,
  })
  const [substitutions, setSubstitutions] = useState({})
  const userId = '1' // Hardcoded for now

  useEffect(() => {
    loadWorkoutLogs()
    loadPlannedWorkouts()
  }, [])

  useEffect(() => {
    loadWorkoutForDate()
  }, [selectedDate])

  const loadWorkoutLogs = async () => {
    try {
      // Load last 3 months of logs
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      const logs = await getWorkoutLogs(
        userId,
        threeMonthsAgo.toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      )
      setWorkoutLogs(logs)
    } catch (err) {
      console.error('Failed to load workout logs:', err)
    }
  }

  const loadPlannedWorkouts = async () => {
    try {
      const planned = await getPlannedWorkouts(userId)
      setPlannedWorkouts(planned)
    } catch (err) {
      console.error('Failed to load planned workouts:', err)
    }
  }

  const loadWorkoutForDate = async () => {
    try {
      setLoading(true)
      setError(null)
      // Format date as YYYY-MM-DD using local time to avoid timezone issues
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      const data = await getTodaysWorkout(userId, dateString)
      setWorkout(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleOpenSubstitution = (exerciseName) => {
    setSubstitutionModal({
      open: true,
      exercise: exerciseName,
    })
  }

  const handleSubstitution = (originalExercise, newExercise, validation) => {
    setSubstitutions((prev) => ({
      ...prev,
      [originalExercise]: {
        newExercise,
        validation,
        timestamp: new Date(),
      },
    }))
  }

  const getDisplayExerciseName = (exerciseName) => {
    if (substitutions[exerciseName]) {
      return substitutions[exerciseName].newExercise
    }
    return exerciseName
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            ...glassmorphism,
            p: 3,
            mb: 4,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <CalendarMonthIcon sx={{ fontSize: 40, color: 'white' }} />
            </motion.div>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Training Plan
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              ...glassmorphism,
              mb: 2,
              background: 'rgba(239, 68, 68, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'rgba(248, 113, 113, 1)' }
            }}
          >
            Error: {error.message}
          </Alert>
        </motion.div>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          gap: 3,
        }}
      >
        {/* Calendar */}
        <Box>
          <WorkoutCalendar
            workoutLogs={workoutLogs}
            plannedWorkouts={plannedWorkouts}
            onDateSelect={handleDateSelect}
          />
        </Box>

        {/* Workout Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              ...glassmorphism,
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              p: 3
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                Workout for {selectedDate.toLocaleDateString()}
              </Typography>
              {selectedDate.toDateString() === new Date().toDateString() && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Chip
                    label="Today"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </motion.div>
              )}
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    height={120}
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}
                  />
                ))}
              </Box>
            ) : workout ? (
              <Box>
                {workout.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        mb: 2,
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.12)',
                          borderColor: 'rgba(255, 255, 255, 0.25)',
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FitnessCenterIcon sx={{ fontSize: 20, color: 'rgba(99, 102, 241, 1)' }} />
                            <Typography
                              variant="h6"
                              sx={{
                                color: 'white',
                                fontWeight: 600
                              }}
                            >
                              {getDisplayExerciseName(exercise.name)}
                            </Typography>
                          </Box>
                          {substitutions[exercise.name] && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <Chip
                                label={`Substituted from: ${exercise.name}`}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(251, 146, 60, 0.3)',
                                  color: 'white',
                                  fontWeight: 600,
                                  border: '1px solid rgba(251, 146, 60, 0.5)',
                                  mt: 0.5
                                }}
                              />
                            </motion.div>
                          )}
                        </Box>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="small"
                            startIcon={<SwapHorizIcon />}
                            onClick={() => handleOpenSubstitution(exercise.name)}
                            sx={{
                              color: 'white',
                              bgcolor: 'rgba(99, 102, 241, 0.2)',
                              border: '1px solid rgba(99, 102, 241, 0.4)',
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: 'rgba(99, 102, 241, 0.3)',
                                borderColor: 'rgba(99, 102, 241, 0.6)'
                              }
                            }}
                          >
                            Substitute
                          </Button>
                        </motion.div>
                      </Box>

                      {exercise.sets && exercise.sets.length > 0 && (
                        <Box sx={{ mt: 2, pl: 1 }}>
                          {exercise.sets.map((set, i) => (
                            <Typography
                              key={i}
                              variant="body2"
                              sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 0.5 }}
                            >
                              • {set.sets} × {set.reps} @{' '}
                              {set.weight
                                ? `${set.weight}${set.unit}`
                                : `${set.percentage}%`}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {substitutions[exercise.name]?.validation?.warning && (
                        <Alert
                          severity="warning"
                          sx={{
                            mt: 2,
                            bgcolor: 'rgba(251, 146, 60, 0.15)',
                            color: 'white',
                            border: '1px solid rgba(251, 146, 60, 0.3)',
                            '& .MuiAlert-icon': { color: 'rgba(251, 191, 36, 1)' }
                          }}
                        >
                          {substitutions[exercise.name].validation.warning}
                        </Alert>
                      )}
                    </Paper>
                  </motion.div>
                ))}

                {Object.keys(substitutions).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Alert
                      severity="info"
                      sx={{
                        mt: 2,
                        bgcolor: 'rgba(59, 130, 246, 0.15)',
                        color: 'white',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        '& .MuiAlert-icon': { color: 'rgba(96, 165, 250, 1)' }
                      }}
                    >
                      <strong>Note:</strong> You have made{' '}
                      {Object.keys(substitutions).length} substitution(s). These
                      will be saved when you log your workout.
                    </Alert>
                  </motion.div>
                )}
              </Box>
            ) : (
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}>
                No workout planned for this date
              </Typography>
            )}
          </Paper>
        </motion.div>
      </Box>

      <ExerciseSubstitutionModal
        open={substitutionModal.open}
        exerciseName={substitutionModal.exercise}
        onClose={() => setSubstitutionModal({ open: false, exercise: null })}
        onSubstitute={handleSubstitution}
        userId={userId}
      />
    </Container>
  )
}

export default Plan
