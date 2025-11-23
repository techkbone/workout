const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', '..', 'data', 'program.json');

let programData = null;

/**
 * Get the full program data, caching it in memory
 * @returns {Promise<Object|null>} Program data or null on error
 */
async function getProgramData() {
  if (programData) {
    return programData;
  }
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    programData = JSON.parse(data);
    return programData;
  } catch (error) {
    console.error('Failed to read or parse program.json:', error);
    return null;
  }
}

/**
 * Format date to YYYY-MM-DD string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const d = new Date(date);
  // Use UTC methods to avoid timezone issues
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get workout for a specific date
 * Returns workout session with exercise details from the exercise library
 * @param {Date|string} date - Target date
 * @returns {Promise<Object|null>} Workout session or null if not found
 */
async function getTodaysWorkout(date) {
  console.log(`[programService] getTodaysWorkout called with date: ${date}`);
  const program = await getProgramData();
  if (!program || !program.phases) {
    console.log('[programService] Program data or phases not found.');
    return null;
  }

  const todayString = formatDate(date);
  console.log(`[programService] Searching for workout on date: ${todayString}`);

  // Search through phases and weeks for the matching date
  for (const phase of program.phases) {
    if (!phase.weeks) continue;
    for (const week of phase.weeks) {
      if (!week.sessions) continue;
      for (const session of week.sessions) {
        if (session.date === todayString) {
          console.log(`[programService] Match found for ${todayString}!`);

          // Enrich session with exercise details from library
          const enrichedSession = {
            ...session,
            phase: phase.name,
            weekNumber: week.weekNumber
          };

          // If there's a main exercise, get its details from the library
          if (session.mainExercise && program.exercises) {
            const exerciseDetails = program.exercises.find(
              ex => ex.name.toLowerCase() === session.mainExercise.toLowerCase()
            );
            if (exerciseDetails) {
              enrichedSession.exerciseDetails = exerciseDetails;
            }
          }

          return enrichedSession;
        }
      }
    }
  }

  console.log(`[programService] No workout found for ${todayString}`);
  return null; // No workout found for today
}

/**
 * Get all planned workouts across all phases
 * @returns {Promise<Array>} Array of all planned workout sessions
 */
async function getAllPlannedWorkouts() {
  const program = await getProgramData();
  if (!program || !program.phases) {
    return [];
  }

  const plannedWorkouts = [];

  for (const phase of program.phases) {
    if (!phase.weeks) continue;
    for (const week of phase.weeks) {
      if (!week.sessions) continue;
      for (const session of week.sessions) {
        if (session.date && session.date !== 'null') {
          plannedWorkouts.push({
            date: session.date,
            day: session.day,
            sessionType: session.sessionType,
            mainExercise: session.mainExercise,
            phase: phase.name,
            weekNumber: week.weekNumber,
            completed: session.completed || false
          });
        }
      }
    }
  }

  return plannedWorkouts.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get all exercises from the exercise library
 * @returns {Promise<Array>} Array of exercise definitions
 */
async function getExerciseLibrary() {
  const program = await getProgramData();
  if (!program || !program.exercises) {
    return [];
  }
  return program.exercises;
}

/**
 * Get exercise details by name from the library
 * @param {string} exerciseName - Name of the exercise
 * @returns {Promise<Object|null>} Exercise details or null if not found
 */
async function getExerciseByName(exerciseName) {
  const program = await getProgramData();
  if (!program || !program.exercises) {
    return null;
  }

  return program.exercises.find(
    ex => ex.name.toLowerCase() === exerciseName.toLowerCase()
  ) || null;
}

/**
 * Get phase metadata
 * @returns {Promise<Array>} Array of phase metadata
 */
async function getPhaseMetadata() {
  const program = await getProgramData();
  if (!program || !program.metadata || !program.metadata.phases) {
    return [];
  }
  return program.metadata.phases;
}

/**
 * Clear cached program data (useful for testing or updates)
 */
function clearCache() {
  programData = null;
}

module.exports = {
  getProgramData,
  getTodaysWorkout,
  getAllPlannedWorkouts,
  getExerciseLibrary,
  getExerciseByName,
  getPhaseMetadata,
  clearCache
};
