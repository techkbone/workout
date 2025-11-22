const API_URL = 'http://localhost:3001/api'

async function getTodaysWorkout(userId) {
  const res = await fetch(`${API_URL}/workouts/today`, {
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

export {
  getTodaysWorkout,
  logWorkout,
  getPersonalRecords,
  getExerciseHistory,
  getProgressAnalytics,
}
