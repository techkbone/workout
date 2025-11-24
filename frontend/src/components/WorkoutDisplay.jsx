import { Box, Typography, Chip, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import ExerciseCard from './ExerciseCard'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { glassmorphism } from '../theme/customTheme'

/**
 * WorkoutDisplay component shows the full workout session with exercise cards
 * @param {Object} props
 * @param {Object} props.workout - Workout session data
 */
function WorkoutDisplay({ workout }) {
  if (!workout) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="body1" sx={{ color: 'white', fontSize: '1.1rem' }}>
            Aucun entraînement prévu pour cette date
          </Typography>
        </motion.div>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Workout Header with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Paper
          elevation={0}
          sx={{
            ...glassmorphism,
            p: 3,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.3)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CalendarTodayIcon sx={{ mr: 1, color: 'white', fontSize: 28 }} />
            </motion.div>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              {workout.day} - {workout.sessionType}
            </Typography>
          </Box>

          {workout.phase && (
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 500,
                textShadow: '0 1px 5px rgba(0,0,0,0.2)'
              }}
            >
              {workout.phase}
            </Typography>
          )}

          {workout.weekNumber && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <Chip
                label={`Semaine ${workout.weekNumber}`}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    bgcolor: 'rgba(255,255,255,0.35)'
                  }
                }}
              />
            </motion.div>
          )}
        </Paper>
      </motion.div>

      {/* Main Exercise */}
      {workout.mainExercise && workout.exerciseDetails ? (
        <ExerciseCard
          exercise={{
            name: workout.mainExercise,
            exerciseDetails: workout.exerciseDetails
          }}
        >
          {/* Sets/Reps/Load info */}
          <Box sx={{ mt: 2 }}>
            {workout.sets && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Volume:</strong> {workout.sets}
              </Typography>
            )}
            {workout.load && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Charge:</strong> {workout.load}
              </Typography>
            )}
            {workout.rpe && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>RPE:</strong> {workout.rpe}/10
              </Typography>
            )}
          </Box>
        </ExerciseCard>
      ) : workout.mainExercise ? (
        // Fallback if no exercise details
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Paper
            sx={{
              ...glassmorphism,
              p: 2,
              mb: 2,
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FitnessCenterIcon sx={{ mr: 1, color: 'white', fontSize: 24 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                {workout.mainExercise}
              </Typography>
            </Box>
            {workout.sets && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Sets: {workout.sets}
              </Typography>
            )}
            {workout.load && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Charge: {workout.load}
              </Typography>
            )}
            {workout.rpe && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                RPE: {workout.rpe}/10
              </Typography>
            )}
          </Paper>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Paper
            sx={{
              ...glassmorphism,
              p: 2,
              mb: 2,
              textAlign: 'center',
              background: 'rgba(255, 200, 0, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 200, 0, 0.3)',
              borderRadius: 3
            }}
          >
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
              ⚠️ Exercice à définir - Consultez la bibliothèque d&apos;exercices
            </Typography>
          </Paper>
        </motion.div>
      )}

      {/* Workout Notes */}
      {workout.notes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Paper
            sx={{
              ...glassmorphism,
              p: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}
              gutterBottom
            >
              📝 Notes:
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              {workout.notes}
            </Typography>
          </Paper>
        </motion.div>
      )}
    </Box>
  )
}

export default WorkoutDisplay
