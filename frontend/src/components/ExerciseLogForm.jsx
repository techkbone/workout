import { useState } from 'react'
import { Button, TextField, Box, Typography } from '@mui/material'

function ExerciseLogForm({ exercise, onSubmit }) {
  const [sets, setSets] = useState(
    Array(exercise.sets[0]?.sets || 1)
      .fill(null)
      .map(() => ({ weight: '', reps: '' }))
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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">{exercise.name}</Typography>
      {sets.map((set, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <TextField
            label="Weight"
            value={set.weight}
            onChange={(e) => handleChange(i, 'weight', e.target.value)}
          />
          <TextField
            label="Reps"
            value={set.reps}
            onChange={(e) => handleChange(i, 'reps', e.target.value)}
          />
        </Box>
      ))}
      <Button type="submit" variant="contained">
        Log Exercise
      </Button>
    </Box>
  )
}

export default ExerciseLogForm
