// Use environment variable or default for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Utility function for exponential backoff retry logic
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of the function
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Request failed, retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Enhanced fetch wrapper with error handling
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
async function fetchWithError(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    error.status = response.status;
    error.statusText = response.statusText;

    // Try to parse error body
    try {
      const errorData = await response.json();
      error.data = errorData;
      error.message = errorData.error || errorData.message || error.message;
    } catch {
      // If response is not JSON, use status text
    }

    throw error;
  }

  return response.json();
}

/**
 * Get today's workout or workout for a specific date
 * @param {string} userId - User ID
 * @param {string|null} date - Optional date in YYYY-MM-DD format
 * @returns {Promise<Object>} Workout data
 */
async function getTodaysWorkout(userId, date = null) {
  const url = date
    ? `${API_URL}/workouts/today?date=${encodeURIComponent(date)}`
    : `${API_URL}/workouts/today`;

  return retryWithBackoff(() =>
    fetchWithError(url, {
      headers: {
        'x-user-id': userId,
      },
    })
  );
}

/**
 * Log a completed workout
 * @param {string} userId - User ID
 * @param {Object} workoutData - Workout data to log
 * @returns {Promise<Object>} Logged workout
 */
async function logWorkout(userId, workoutData) {
  // Don't retry POST requests by default (only retry once on network error)
  return retryWithBackoff(() =>
    fetchWithError(`${API_URL}/workouts/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify(workoutData),
    }),
    1 // Only 1 retry for POST to avoid duplicate logs
  );
}

/**
 * Get personal records for exercises
 * @param {string} userId - User ID
 * @param {string|null} exerciseName - Optional specific exercise
 * @returns {Promise<Array>} Personal records
 */
async function getPersonalRecords(userId, exerciseName = null) {
  const url = exerciseName
    ? `${API_URL}/analytics/prs?exercise=${encodeURIComponent(exerciseName)}`
    : `${API_URL}/analytics/prs`;

  return retryWithBackoff(() =>
    fetchWithError(url, {
      headers: {
        'x-user-id': userId,
      },
    })
  );
}

/**
 * Get exercise history for a specific exercise
 * @param {string} userId - User ID
 * @param {string} exerciseName - Exercise name
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} Exercise history
 */
async function getExerciseHistory(userId, exerciseName, limit = 50) {
  return retryWithBackoff(() =>
    fetchWithError(
      `${API_URL}/analytics/exercise-history/${encodeURIComponent(exerciseName)}?limit=${limit}`,
      {
        headers: {
          'x-user-id': userId,
        },
      }
    )
  );
}

/**
 * Get progress analytics for an exercise
 * @param {string} userId - User ID
 * @param {string} exerciseName - Exercise name
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Object>} Progress analytics
 */
async function getProgressAnalytics(userId, exerciseName, days = 90) {
  return retryWithBackoff(() =>
    fetchWithError(
      `${API_URL}/analytics/progress/${encodeURIComponent(exerciseName)}?days=${days}`,
      {
        headers: {
          'x-user-id': userId,
        },
      }
    )
  );
}

/**
 * Get workout logs within a date range
 * @param {string} userId - User ID
 * @param {string|null} startDate - Start date (YYYY-MM-DD)
 * @param {string|null} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Workout logs
 */
async function getWorkoutLogs(userId, startDate = null, endDate = null) {
  let url = `${API_URL}/workouts/logs?`;
  if (startDate) url += `startDate=${startDate}&`;
  if (endDate) url += `endDate=${endDate}&`;

  return retryWithBackoff(() =>
    fetchWithError(url, {
      headers: {
        'x-user-id': userId,
      },
    })
  );
}

/**
 * Get alternative exercises for substitution
 * @param {string} userId - User ID
 * @param {string} exerciseName - Original exercise name
 * @param {string|null} reason - Reason for substitution
 * @returns {Promise<Array>} Alternative exercises
 */
async function getAlternativeExercises(userId, exerciseName, reason = null) {
  const url = reason
    ? `${API_URL}/substitutions/alternatives/${encodeURIComponent(exerciseName)}?reason=${encodeURIComponent(reason)}`
    : `${API_URL}/substitutions/alternatives/${encodeURIComponent(exerciseName)}`;

  return retryWithBackoff(() =>
    fetchWithError(url, {
      headers: {
        'x-user-id': userId,
      },
    })
  );
}

/**
 * Validate an exercise substitution
 * @param {string} userId - User ID
 * @param {string} originalExercise - Original exercise name
 * @param {string} substituteExercise - Substitute exercise name
 * @returns {Promise<Object>} Validation result
 */
async function validateSubstitution(userId, originalExercise, substituteExercise) {
  return retryWithBackoff(() =>
    fetchWithError(`${API_URL}/substitutions/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({ originalExercise, substituteExercise }),
    }),
    1 // Only 1 retry for validation
  );
}

/**
 * Get all planned workouts from the program
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Planned workouts
 */
async function getPlannedWorkouts(userId) {
  return retryWithBackoff(() =>
    fetchWithError(`${API_URL}/workouts/planned`, {
      headers: {
        'x-user-id': userId,
      },
    })
  );
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
