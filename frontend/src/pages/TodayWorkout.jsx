import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Container, Typography, Button, Alert, CircularProgress, Box, Paper } from '@mui/material'
import { getTodaysWorkout, logWorkout } from '../services/apiClient'
import WorkoutDisplay from '../components/WorkoutDisplay'
import ExerciseLogForm from '../components/ExerciseLogForm'
import { glassmorphism } from '../theme/customTheme'

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Alert
            severity="error"
            sx={{
              ...glassmorphism,
              mt: 2,
              background: 'rgba(239, 68, 68, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'rgba(248, 113, 113, 1)' }
            }}
          >
            Erreur lors du chargement de l&apos;entraînement: {error.message}
          </Alert>
        </motion.div>
      </Container>
    )
  }

  if (!workout) {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Alert
            severity="info"
            sx={{
              ...glassmorphism,
              mt: 2,
              background: 'rgba(59, 130, 246, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'rgba(96, 165, 250, 1)' }
            }}
          >
            Aucun entraînement prévu pour aujourd&apos;hui
          </Alert>
        </motion.div>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      {/* Display the workout with exercise details */}
      <WorkoutDisplay workout={workout} />

      {/* Success/Error alerts */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Alert
            severity="success"
            sx={{
              ...glassmorphism,
              mt: 2,
              mb: 2,
              background: 'rgba(16, 185, 129, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'white',
              fontWeight: 600,
              '& .MuiAlert-icon': { color: 'rgba(52, 211, 153, 1)' }
            }}
          >
            ✅ Entraînement enregistré avec succès!
          </Alert>
        </motion.div>
      )}

      {/* Exercise logging form - only if there's a main exercise */}
      {workout.mainExercise && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Paper
            sx={{
              ...glassmorphism,
              mt: 3,
              p: 3,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                mb: 2
              }}
            >
              📝 Logger votre performance
            </Typography>
            <ExerciseLogForm
              exercise={{
                name: workout.mainExercise,
                sets: workout.sets ? [{ sets: workout.sets }] : []
              }}
              onSubmit={handleLogSubmit}
            />
          </Paper>
        </motion.div>
      )}

      {/* Submit button */}
      {workout.mainExercise && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmitWorkout}
            disabled={Object.keys(exerciseLogs).length === 0}
            fullWidth
            sx={{
              mt: 3,
              py: 2,
              background: Object.keys(exerciseLogs).length === 0
                ? 'rgba(100, 100, 100, 0.3)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: 3,
              boxShadow: Object.keys(exerciseLogs).length === 0
                ? 'none'
                : '0 4px 20px rgba(16, 185, 129, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: Object.keys(exerciseLogs).length === 0
                  ? 'rgba(100, 100, 100, 0.3)'
                  : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: Object.keys(exerciseLogs).length === 0
                  ? 'none'
                  : '0 6px 25px rgba(16, 185, 129, 0.6)',
                transform: Object.keys(exerciseLogs).length === 0 ? 'none' : 'translateY(-2px)'
              },
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            Enregistrer l&apos;entraînement
          </Button>
        </motion.div>
      )}
    </Container>
  )
}

export default TodayWorkout
