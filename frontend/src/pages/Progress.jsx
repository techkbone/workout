import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Paper,
  Skeleton
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BarChartIcon from '@mui/icons-material/BarChart'
import { getPersonalRecords, getProgressAnalytics } from '../services/apiClient'
import PRDisplay from '../components/PRDisplay'
import ExerciseHistoryChart from '../components/ExerciseHistoryChart'
import { glassmorphism } from '../theme/customTheme'

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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUpIcon sx={{ fontSize: 40, color: 'white' }} />
            </motion.div>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Progress & Personal Records
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

      {/* All Personal Records Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Paper
          elevation={0}
          sx={{
            ...glassmorphism,
            p: 3,
            mb: 4,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <BarChartIcon sx={{ color: 'rgba(99, 102, 241, 1)', fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              All Personal Records
            </Typography>
          </Box>
          {loading && !prs.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={60}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                />
              ))}
            </Box>
          ) : (
            <PRDisplay prs={prs} />
          )}
        </Paper>
      </motion.div>

      {/* Exercise Progress Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper
          elevation={0}
          sx={{
            ...glassmorphism,
            p: 3,
            mb: 4,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mb: 3,
              color: 'white',
              fontWeight: 700,
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            Exercise Progress Analysis
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Select Exercise</InputLabel>
              <Select
                value={selectedExercise}
                label="Select Exercise"
                onChange={(e) => {
                  setSelectedExercise(e.target.value)
                  setCustomExercise('')
                }}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(99, 102, 241, 0.6)'
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
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

            <Typography
              align="center"
              sx={{
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 500
              }}
            >
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.6)',
                    borderWidth: 2
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgba(99, 102, 241, 1)'
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Time Period</InputLabel>
              <Select
                value={period}
                label="Time Period"
                onChange={(e) => setPeriod(e.target.value)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(99, 102, 241, 0.6)'
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                }}
              >
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
                <MenuItem value={180}>Last 6 months</MenuItem>
                <MenuItem value={365}>Last year</MenuItem>
              </Select>
            </FormControl>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                onClick={loadExerciseProgress}
                disabled={loading || (!selectedExercise && !customExercise)}
                fullWidth
                sx={{
                  py: 1.5,
                  background: loading || (!selectedExercise && !customExercise)
                    ? 'rgba(100, 100, 100, 0.3)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 3,
                  boxShadow: loading || (!selectedExercise && !customExercise)
                    ? 'none'
                    : '0 4px 15px rgba(102, 126, 234, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: loading || (!selectedExercise && !customExercise)
                      ? 'rgba(100, 100, 100, 0.3)'
                      : 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                    boxShadow: loading || (!selectedExercise && !customExercise)
                      ? 'none'
                      : '0 6px 20px rgba(102, 126, 234, 0.6)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Analyze Progress'}
              </Button>
            </motion.div>
          </Box>

          {progressData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ExerciseHistoryChart
                exerciseName={progressData.exerciseName}
                progressData={progressData}
              />
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Container>
  )
}

export default Progress
