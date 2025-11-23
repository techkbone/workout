const XLSX = require('xlsx');

/**
 * Parse the Excel workout program file and convert to JSON format
 * @param {string} filePath - Path to the Excel file
 * @returns {Object} Parsed program data in JSON format
 */
function parseExcelProgram(filePath) {
  const workbook = XLSX.readFile(filePath);

  const program = {
    title: "Programme Westside Rugby Masters 2025-2026",
    phases: [],
    exercises: [],
    metadata: {}
  };

  // Parse "Aperçu Phases" sheet
  if (workbook.SheetNames.includes('Aperçu Phases')) {
    const phaseSheet = workbook.Sheets['Aperçu Phases'];
    const phaseData = XLSX.utils.sheet_to_json(phaseSheet);

    program.metadata.phases = phaseData.map(phase => ({
      name: phase.Phase,
      weeks: phase.Semaines,
      dates: phase.Dates,
      objective: phase['Objectif Principal'],
      intensityME: phase['Intensité ME'],
      intensityDE: phase['Intensité DE'],
      notes: phase['Notes Clés']
    }));
  }

  // Parse "Bibliothèque Exercices" sheet
  if (workbook.SheetNames.includes('Bibliothèque Exercices')) {
    const exerciseSheet = workbook.Sheets['Bibliothèque Exercices'];
    const exerciseData = XLSX.utils.sheet_to_json(exerciseSheet);

    program.exercises = exerciseData.map(ex => ({
      name: ex.Exercice,
      category: ex.Catégorie,
      equipment: ex.Équipement,
      videoUrl: ex['Vidéo Demo'],
      animationUrl: ex['Image/GIF'],
      technicalNotes: ex['Notes Technique']
    }));
  }

  // Parse "Programme Complet" sheet - main workout schedule
  if (workbook.SheetNames.includes('Programme Complet')) {
    const programSheet = workbook.Sheets['Programme Complet'];
    const programData = XLSX.utils.sheet_to_json(programSheet);

    // Group workouts by phase and week
    const phaseMap = new Map();

    programData.forEach(row => {
      const phaseName = row.Phase;
      const weekNum = row.Sem;
      const date = row.Date;

      if (!date || !phaseName) return; // Skip empty rows

      // Initialize phase if not exists
      if (!phaseMap.has(phaseName)) {
        phaseMap.set(phaseName, {
          name: phaseName,
          weeks: new Map()
        });
      }

      const phase = phaseMap.get(phaseName);

      // Initialize week if not exists
      if (!phase.weeks.has(weekNum)) {
        phase.weeks.set(weekNum, {
          weekNumber: weekNum,
          sessions: []
        });
      }

      const week = phase.weeks.get(weekNum);

      // Parse the workout session
      const session = {
        date: formatExcelDate(date),
        day: row.Jour,
        sessionType: row['Type Séance'],
        mainExercise: row['Exercice Principal'] !== 'À compléter' ? row['Exercice Principal'] : null,
        sets: row['Sets×Reps'] || null,
        load: row.Charge || null,
        rpe: row.RPE || null,
        videoLink: row['Voir Vidéo'],
        notes: row.Notes || null,
        completed: row.Complet === 'X' || row.Complet === true
      };

      week.sessions.push(session);
    });

    // Convert Maps to Arrays for JSON serialization
    program.phases = Array.from(phaseMap.values()).map(phase => ({
      name: phase.name,
      weeks: Array.from(phase.weeks.values())
    }));
  }

  return program;
}

/**
 * Format Excel date to ISO format (YYYY-MM-DD)
 * Excel stores dates as numbers, XLSX library converts them
 * @param {string|number|Date} excelDate - Excel date value
 * @returns {string} ISO formatted date string
 */
function formatExcelDate(excelDate) {
  if (!excelDate) return null;

  // If already a string in YYYY-MM-DD format
  if (typeof excelDate === 'string' && excelDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return excelDate;
  }

  // If it's an Excel serial number
  if (typeof excelDate === 'number') {
    const date = XLSX.SSF.parse_date_code(excelDate);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }

  // If it's a Date object
  if (excelDate instanceof Date) {
    return excelDate.toISOString().split('T')[0];
  }

  return excelDate;
}

/**
 * Get workout sessions for a specific date
 * @param {Object} program - Parsed program object
 * @param {Date|string} targetDate - Target date to find workouts
 * @returns {Array} Array of workout sessions for that date
 */
function getWorkoutByDate(program, targetDate) {
  const dateStr = targetDate instanceof Date
    ? targetDate.toISOString().split('T')[0]
    : targetDate;

  const sessions = [];

  program.phases.forEach(phase => {
    phase.weeks.forEach(week => {
      week.sessions.forEach(session => {
        if (session.date === dateStr) {
          sessions.push({
            ...session,
            phase: phase.name,
            weekNumber: week.weekNumber
          });
        }
      });
    });
  });

  return sessions;
}

/**
 * Get all workout sessions within a date range
 * @param {Object} program - Parsed program object
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Array} Array of workout sessions in the range
 */
function getWorkoutsByDateRange(program, startDate, endDate) {
  const start = startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate;
  const end = endDate instanceof Date ? endDate.toISOString().split('T')[0] : endDate;

  const sessions = [];

  program.phases.forEach(phase => {
    phase.weeks.forEach(week => {
      week.sessions.forEach(session => {
        if (session.date >= start && session.date <= end) {
          sessions.push({
            ...session,
            phase: phase.name,
            weekNumber: week.weekNumber
          });
        }
      });
    });
  });

  return sessions.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get exercise details from the exercise library
 * @param {Object} program - Parsed program object
 * @param {string} exerciseName - Name of the exercise
 * @returns {Object|null} Exercise details or null if not found
 */
function getExerciseDetails(program, exerciseName) {
  return program.exercises.find(ex =>
    ex.name.toLowerCase() === exerciseName.toLowerCase()
  ) || null;
}

module.exports = {
  parseExcelProgram,
  formatExcelDate,
  getWorkoutByDate,
  getWorkoutsByDateRange,
  getExerciseDetails
};
