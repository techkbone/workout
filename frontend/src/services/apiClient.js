const API_URL = 'http://localhost:3001/api'

async function getTodaysWorkout(userId, date = null) {
  const url = date
    ? `${API_URL}/workouts/today?date=${encodeURIComponent(date)}`
    : `${API_URL}/workouts/today`

  const res = await fetch(url, {
    headers: {
      'x-user-id': userId,
    },
  })
  if (!res.ok) {
    throw new Error("Failed to fetch today's workout")
  }
  return res.json()
}

async function logWorkout(userId, workoutData) {
  const res = await fetch(`${API_URL}/workouts/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify(workoutData),
  })
  if (!res.ok) {
    throw new Error('Failed to log workout')
  }
  return res.json()
}

async function getPersonalRecords(userId, exerciseName = null) {
  const url = exerciseName
    ? `${API_URL}/analytics/prs?exercise=${encodeURIComponent(exerciseName)}`
    : `${API_URL}/analytics/prs`

  const res = await fetch(url, {
    headers: {
      'x-user-id': userId,
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch personal records')
  }
  return res.json()
}

async function getExerciseHistory(userId, exerciseName, limit = 50) {
  const res = await fetch(
    `${API_URL}/analytics/exercise-history/${encodeURIComponent(exerciseName)}?limit=${limit}`,
    {
      headers: {
        'x-user-id': userId,
      },
    }
  )
  if (!res.ok) {
    throw new Error('Failed to fetch exercise history')
  }
  return res.json()
}

async function getProgressAnalytics(userId, exerciseName, days = 90) {
  const res = await fetch(
    `${API_URL}/analytics/progress/${encodeURIComponent(exerciseName)}?days=${days}`,
    {
      headers: {
        'x-user-id': userId,
      },
    }
  )
  if (!res.ok) {
    throw new Error('Failed to fetch progress analytics')
  }
  return res.json()
}

async function getWorkoutLogs(userId, startDate = null, endDate = null) {
  let url = `${API_URL}/workouts/logs?`
  if (startDate) url += `startDate=${startDate}&`
  if (endDate) url += `endDate=${endDate}&`

  const res = await fetch(url, {
    headers: {
      'x-user-id': userId,
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch workout logs')
  }
  return res.json()
}

async function getAlternativeExercises(userId, exerciseName, reason = null) {
  const url = reason
    ? `${API_URL}/substitutions/alternatives/${encodeURIComponent(exerciseName)}?reason=${encodeURIComponent(reason)}`
    : `${API_URL}/substitutions/alternatives/${encodeURIComponent(exerciseName)}`

  const res = await fetch(url, {
    headers: {
      'x-user-id': userId,
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch alternatives')
  }
  return res.json()
}

async function validateSubstitution(
  userId,
  originalExercise,
  substituteExercise
) {
  const res = await fetch(`${API_URL}/substitutions/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ originalExercise, substituteExercise }),
  })
  if (!res.ok) {
    throw new Error('Failed to validate substitution')
  }
  return res.json()
}

async function getPlannedWorkouts(userId) {
  const res = await fetch(`${API_URL}/workouts/planned`, {
    headers: {
      'x-user-id': userId,
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch planned workouts')
  }
  return res.json()
}

export {
  getTodaysWorkout,
  logWorkout,
  getPersonalRecords,
  getExerciseHistory,
  getProgressAnalytics,
  getWorkoutLogs,
  getAlternativeExercises,
  validateSubstitution,
  getPlannedWorkouts,
}
