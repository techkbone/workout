import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { getPersonalRecords, getProgressAnalytics } from '../services/apiClient'
import PRDisplay from '../components/PRDisplay'
import ExerciseHistoryChart from '../components/ExerciseHistoryChart'

// Common exercises from the program
const COMMON_EXERCISES = [
  'Trap Bar Deadlift',
  'Floor Press Haltères',
  'Box Squats',
  'Goblet Squats',
  'Incline Press',
  'Overhead Press',
  'KB Swings',
]

function Progress() {
  const [prs, setPRs] = useState([])
  const [progressData, setProgressData] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState('')
  const [customExercise, setCustomExercise] = useState('')
  const [period, setPeriod] = useState(90)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const userId = '1' // Hardcoded for now

  // Load all PRs on component mount
  useEffect(() => {
    loadAllPRs()
  }, [])

  const loadAllPRs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPersonalRecords(userId)
      setPRs(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const loadExerciseProgress = async () => {
    const exercise = customExercise || selectedExercise

    if (!exercise) {
      setError(new Error('Please select or enter an exercise name'))
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getProgressAnalytics(userId, exercise, period)
      setProgressData(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Progress & Personal Records
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          Error: {error.message}
        </Alert>
      )}

      {/* All Personal Records Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          All Personal Records
        </Typography>
        {loading && !prs.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <PRDisplay prs={prs} />
        )}
      </Box>

      {/* Exercise Progress Analysis Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Exercise Progress Analysis
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select Exercise</InputLabel>
            <Select
              value={selectedExercise}
              label="Select Exercise"
              onChange={(e) => {
                setSelectedExercise(e.target.value)
                setCustomExercise('')
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {COMMON_EXERCISES.map((exercise) => (
                <MenuItem key={exercise} value={exercise}>
                  {exercise}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography align="center" sx={{ fontStyle: 'italic' }}>
            - OR -
          </Typography>

          <TextField
            label="Enter Custom Exercise Name"
            value={customExercise}
            onChange={(e) => {
              setCustomExercise(e.target.value)
              setSelectedExercise('')
            }}
            fullWidth
            placeholder="e.g., Bench Press"
          />

          <FormControl fullWidth>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={period}
              label="Time Period"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
              <MenuItem value={180}>Last 6 months</MenuItem>
              <MenuItem value={365}>Last year</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={loadExerciseProgress}
            disabled={loading || (!selectedExercise && !customExercise)}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Progress'}
          </Button>
        </Box>

        {progressData && (
          <ExerciseHistoryChart
            exerciseName={progressData.exerciseName}
            progressData={progressData}
          />
        )}
      </Box>
    </Container>
  )
}

export default Progress
