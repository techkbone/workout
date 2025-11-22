import { useState, useEffect } from 'react'
import { Container, Typography, Button, Alert } from '@mui/material'
import { getTodaysWorkout, logWorkout } from '../services/apiClient'
import WorkoutDisplay from '../components/WorkoutDisplay'
import ExerciseLogForm from '../components/ExerciseLogForm'

function TodayWorkout() {
  const [workout, setWorkout] = useState(null)
  const [error, setError] = useState(null)
  const [exerciseLogs, setExerciseLogs] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    getTodaysWorkout('1') // Hardcoded user ID for now
      .then(setWorkout)
      .catch(setError)
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
        date: new Date().toISOString(),
        exercises: Object.entries(exerciseLogs).map(([name, sets]) => ({
          name,
          sets: sets.map((s) => ({
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps) || 0,
          })),
        })),
      }

      await logWorkout('1', workoutData)
      setSubmitSuccess(true)
      setError(null)
    } catch (err) {
      setError(err)
      setSubmitSuccess(false)
    }
  }

  if (error) {
    return (
      <Typography color="error">
        Error fetching workout: {error.message}
      </Typography>
    )
  }

  if (!workout) {
    return <Typography>Loading workout...</Typography>
  }

  return (
    <Container>
      <WorkoutDisplay workout={workout} />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error.message}
        </Alert>
      )}
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Workout logged successfully!
        </Alert>
      )}
      {workout.map((exercise, index) => (
        <ExerciseLogForm
          key={index}
          exercise={exercise}
          onSubmit={handleLogSubmit}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitWorkout}
        sx={{ mt: 3, mb: 2 }}
        disabled={Object.keys(exerciseLogs).length === 0}
      >
        Submit Workout
      </Button>
    </Container>
  )
}

export default TodayWorkout
