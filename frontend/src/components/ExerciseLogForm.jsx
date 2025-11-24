import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, TextField, Box, Typography, Chip, Paper } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

function ExerciseLogForm({ exercise, onSubmit }) {
  const [sets, setSets] = useState(
    Array(exercise.sets[0]?.sets || 1)
      .fill(null)
      .map(() => ({ weight: '', reps: '', rpe: '' }))
  )

  const handleChange = (setIndex, field, value) => {
    const newSets = [...sets]
    newSets[setIndex][field] = value
    setSets(newSets)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(exercise.name, sets)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Sets Grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sets.map((set, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Paper
              sx={{
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Set Number Badge */}
                <Chip
                  icon={<FitnessCenterIcon sx={{ fontSize: 16 }} />}
                  label={`Set ${i + 1}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.3)',
                    color: 'white',
                    fontWeight: 600,
                    border: '1px solid rgba(99, 102, 241, 0.5)',
                    backdropFilter: 'blur(10px)',
                    minWidth: 80
                  }}
                />

                {/* Weight Input */}
                <TextField
                  label="Poids (kg)"
                  type="number"
                  value={set.weight}
                  onChange={(e) => handleChange(i, 'weight', e.target.value)}
                  size="small"
                  sx={{
                    flex: 1,
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

                {/* Reps Input */}
                <TextField
                  label="Reps"
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleChange(i, 'reps', e.target.value)}
                  size="small"
                  sx={{
                    flex: 1,
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

                {/* RPE Input */}
                <TextField
                  label="RPE"
                  type="number"
                  value={set.rpe}
                  onChange={(e) => handleChange(i, 'rpe', e.target.value)}
                  size="small"
                  inputProps={{ min: 1, max: 10 }}
                  sx={{
                    width: 80,
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
              </Box>
            </Paper>
          </motion.div>
        ))}
      </Box>
    </Box>
  )
}

export default ExerciseLogForm
