import { useState, useEffect } from 'react'
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
} from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import {
  getTodaysWorkout,
  getWorkoutLogs,
  getPlannedWorkouts,
} from '../services/apiClient'
import WorkoutCalendar from '../components/WorkoutCalendar'
import ExerciseSubstitutionModal from '../components/ExerciseSubstitutionModal'

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CalendarMonthIcon fontSize="large" color="primary" />
        <Typography variant="h4">Training Plan</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          Error: {error.message}
        </Alert>
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
        <Box>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Workout for {selectedDate.toLocaleDateString()}
                </Typography>
                {selectedDate.toDateString() === new Date().toDateString() && (
                  <Chip label="Today" color="primary" size="small" />
                )}
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : workout ? (
                <Box>
                  {workout.map((exercise, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="h6">
                              {getDisplayExerciseName(exercise.name)}
                            </Typography>
                            {substitutions[exercise.name] && (
                              <Chip
                                label={`Substituted from: ${exercise.name}`}
                                size="small"
                                color="warning"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                          <Button
                            size="small"
                            startIcon={<SwapHorizIcon />}
                            onClick={() =>
                              handleOpenSubstitution(exercise.name)
                            }
                          >
                            Substitute
                          </Button>
                        </Box>

                        {exercise.sets && exercise.sets.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            {exercise.sets.map((set, i) => (
                              <Typography
                                key={i}
                                variant="body2"
                                color="text.secondary"
                              >
                                {set.sets} × {set.reps} @{' '}
                                {set.weight
                                  ? `${set.weight}${set.unit}`
                                  : `${set.percentage}%`}
                              </Typography>
                            ))}
                          </Box>
                        )}

                        {substitutions[exercise.name]?.validation?.warning && (
                          <Alert severity="warning" sx={{ mt: 2 }}>
                            {substitutions[exercise.name].validation.warning}
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {Object.keys(substitutions).length > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <strong>Note:</strong> You have made{' '}
                      {Object.keys(substitutions).length} substitution(s). These
                      will be saved when you log your workout.
                    </Alert>
                  )}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No workout planned for this date
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
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
