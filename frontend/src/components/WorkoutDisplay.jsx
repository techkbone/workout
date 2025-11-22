import { Card, CardContent, Typography } from '@mui/material'

function WorkoutDisplay({ workout }) {
  if (!workout) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Today&apos;s Workout</Typography>
        {workout.map((exercise, index) => (
          <div key={index}>
            <Typography variant="h6">{exercise.name}</Typography>
            {exercise.sets.map((set, i) => (
              <Typography key={i}>
                {set.sets}x{set.reps} @{' '}
                {set.weight ? `${set.weight}${set.unit}` : `${set.percentage}%`}
              </Typography>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default WorkoutDisplay
