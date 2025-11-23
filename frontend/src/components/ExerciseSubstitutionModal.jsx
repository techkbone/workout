import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Alert,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material'
import {
  getAlternativeExercises,
  validateSubstitution,
} from '../services/apiClient'

function ExerciseSubstitutionModal({
  open,
  onClose,
  exerciseName,
  onSubstitute,
  userId = '1',
}) {
  const [alternatives, setAlternatives] = useState([])
  const [customExercise, setCustomExercise] = useState('')
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [validation, setValidation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAlternatives = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAlternativeExercises(userId, exerciseName)
        setAlternatives(data.alternatives || [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (open && exerciseName) {
      loadAlternatives()
    }
  }, [open, exerciseName, userId])

  const handleSelectAlternative = async (alternative) => {
    setSelectedExercise(alternative)
    setCustomExercise('')

    // Validate the substitution
    try {
      const result = await validateSubstitution(
        userId,
        exerciseName,
        alternative
      )
      setValidation(result)
    } catch (err) {
      setError(err)
    }
  }

  const handleCustomExercise = async () => {
    if (!customExercise) return

    setSelectedExercise(customExercise)

    // Validate custom exercise
    try {
      const result = await validateSubstitution(
        userId,
        exerciseName,
        customExercise
      )
      setValidation(result)
    } catch (err) {
      setError(err)
    }
  }

  const handleConfirm = () => {
    if (selectedExercise) {
      onSubstitute(exerciseName, selectedExercise, validation)
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedExercise(null)
    setCustomExercise('')
    setValidation(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Substitute Exercise: {exerciseName}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {alternatives.length > 0 && (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Suggested alternatives based on movement pattern:
                </Alert>
                <List>
                  {alternatives.map((alternative) => (
                    <ListItem key={alternative} disablePadding>
                      <ListItemButton
                        selected={selectedExercise === alternative}
                        onClick={() => handleSelectAlternative(alternative)}
                      >
                        <ListItemText primary={alternative} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Or enter a custom exercise"
                value={customExercise}
                onChange={(e) => setCustomExercise(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomExercise()
                  }
                }}
                placeholder="e.g., Bench Press"
              />
              <Button
                variant="outlined"
                onClick={handleCustomExercise}
                disabled={!customExercise}
                sx={{ mt: 1 }}
              >
                Use Custom Exercise
              </Button>
            </Box>

            {validation && (
              <Box sx={{ mt: 2 }}>
                <Alert
                  severity={
                    !validation.isValid
                      ? 'error'
                      : validation.warning
                        ? 'warning'
                        : 'success'
                  }
                >
                  <strong>{validation.message}</strong>
                  {validation.warning && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label="Warning"
                        size="small"
                        color="warning"
                        sx={{ mr: 1 }}
                      />
                      {validation.warning}
                    </Box>
                  )}
                </Alert>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedExercise || !validation?.isValid}
        >
          Confirm Substitution
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExerciseSubstitutionModal
