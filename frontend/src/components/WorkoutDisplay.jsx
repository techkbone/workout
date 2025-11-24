import { Box, Typography, Chip, Paper } from '@mui/material'
import ExerciseCard from './ExerciseCard'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

/**
 * WorkoutDisplay component shows the full workout session with exercise cards
 * @param {Object} props
 * @param {Object} props.workout - Workout session data
 */
function WorkoutDisplay({ workout }) {
  if (!workout) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Aucun entraînement prévu pour cette date
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Workout Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarTodayIcon sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            {workout.day} - {workout.sessionType}
          </Typography>
        </Box>

        {workout.phase && (
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {workout.phase}
          </Typography>
        )}

        {workout.weekNumber && (
          <Chip
            label={`Semaine ${workout.weekNumber}`}
            size="small"
            sx={{
              mt: 1,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white'
            }}
          />
        )}
      </Paper>

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
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">{workout.mainExercise}</Typography>
          </Box>
          {workout.sets && <Typography variant="body2">Sets: {workout.sets}</Typography>}
          {workout.load && <Typography variant="body2">Charge: {workout.load}</Typography>}
          {workout.rpe && <Typography variant="body2">RPE: {workout.rpe}/10</Typography>}
        </Paper>
      ) : (
        <Paper sx={{ p: 2, mb: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
          <Typography variant="body1">
            ⚠️ Exercice à définir - Consultez la bibliothèque d&apos;exercices
          </Typography>
        </Paper>
      )}

      {/* Workout Notes */}
      {workout.notes && (
        <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            📝 Notes:
          </Typography>
          <Typography variant="body2">
            {workout.notes}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default WorkoutDisplay
