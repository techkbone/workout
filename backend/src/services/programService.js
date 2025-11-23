const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', '..', 'data', 'program.json');

let programData = null;

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

function formatDate(date) {
  const d = new Date(date);
  // Use UTC methods to avoid timezone issues
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getTodaysWorkout(date) {
  console.log(`[programService] getTodaysWorkout called with date: ${date}`);
  const program = await getProgramData();
  if (!program || !program.phases) {
    console.log('[programService] Program data or phases not found.');
    return [];
  }

  const todayString = formatDate(date);
  console.log(`[programService] Searching for workout on date: ${todayString}`);

  for (const phase of program.phases) {
    if (!phase.weeks) continue;
    for (const week of phase.weeks) {
      if (!week.sessions) continue;
      for (const session of week.sessions) {
        console.log(`[programService] Checking session date: ${session.date}`);
        if (session.date === todayString) {
          console.log(`[programService] Match found for ${todayString}!`);
          let todaysExercises = [];
          if (!session.sections) continue;
          for (const section of session.sections) {
            if (section.exercises) {
              todaysExercises = todaysExercises.concat(section.exercises);
            }
          }
          return todaysExercises;
        }
      }
    }
  }

  console.log(`[programService] No workout found for ${todayString}`);
  return []; // No workout found for today
}

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
          let exerciseCount = 0;
          if (session.sections) {
            for (const section of session.sections) {
              if (section.exercises) {
                exerciseCount += section.exercises.length;
              }
            }
          }

          plannedWorkouts.push({
            date: session.date,
            name: session.name,
            exerciseCount: exerciseCount,
          });
        }
      }
    }
  }

  return plannedWorkouts;
}

module.exports = {
  getProgramData,
  getTodaysWorkout,
  getAllPlannedWorkouts,
};
