import { useState, useEffect } from 'react'
import { Container, Typography, Button, Alert, CircularProgress, Box } from '@mui/material'
import { getTodaysWorkout, logWorkout } from '../services/apiClient'
import WorkoutDisplay from '../components/WorkoutDisplay'
import ExerciseLogForm from '../components/ExerciseLogForm'

function TodayWorkout() {
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exerciseLogs, setExerciseLogs] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    setLoading(true)
    getTodaysWorkout('1') // Hardcoded user ID for now
      .then((data) => {
        setWorkout(data)
        setError(null)
      })
      .catch((err) => {
        setError(err)
        setWorkout(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleLogSubmit = (exerciseName, sets) => {
    setExerciseLogs((prev) => ({
      ...prev,
      [exerciseName]: sets,
    }))
  }

  const handleSubmitWorkout = async () => {
    try {
      const workoutData = {
        sessionId: workout?.date || new Date().toISOString().split('T')[0],
        date: new Date().toISOString(),
        exercises: Object.entries(exerciseLogs).map(([name, sets]) => ({
          name,
          sets: sets.map((s) => ({
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps) || 0,
            rpe: s.rpe ? parseInt(s.rpe) : undefined
          })),
        })),
        notes: workout?.notes || ''
      }

      await logWorkout('1', workoutData)
      setSubmitSuccess(true)
      setError(null)
    } catch (err) {
      setError(err)
      setSubmitSuccess(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Erreur lors du chargement de l&apos;entraînement: {error.message}
        </Alert>
      </Container>
    )
  }

  if (!workout) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>
          Aucun entraînement prévu pour aujourd&apos;hui
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      {/* Display the workout with exercise details */}
      <WorkoutDisplay workout={workout} />

      {/* Success/Error alerts */}
      {submitSuccess && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          ✅ Entraînement enregistré avec succès!
        </Alert>
      )}

      {/* Exercise logging form - only if there's a main exercise */}
      {workout.mainExercise && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            📝 Logger votre performance
          </Typography>
          <ExerciseLogForm
            exercise={{
              name: workout.mainExercise,
              sets: workout.sets ? [{ sets: workout.sets }] : []
            }}
            onSubmit={handleLogSubmit}
          />
        </Box>
      )}

      {/* Submit button */}
      {workout.mainExercise && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmitWorkout}
          disabled={Object.keys(exerciseLogs).length === 0}
          fullWidth
          sx={{ mt: 3 }}
        >
          Enregistrer l&apos;entraînement
        </Button>
      )}
    </Container>
  )
}

export default TodayWorkout
