/**
 * Exercise Substitution Service
 * Provides recommendations for exercise substitutions based on categories and movement patterns
 */

// Exercise database with categories and alternatives
const EXERCISE_DATABASE = {
  // Main Lifts - Lower Body
  'Trap Bar Deadlift': {
    category: 'Lower Body - Posterior Chain',
    type: 'Max Effort',
    alternatives: [
      'Conventional Deadlift',
      'Sumo Deadlift',
      'Deficit Deadlift',
      'Rack Pulls',
    ],
    restrictions: ['Hip injury', 'Lower back pain'],
  },
  'Box Squats': {
    category: 'Lower Body - Squat Pattern',
    type: 'Dynamic Effort',
    alternatives: ['Safety Bar Squats', 'Front Squats', 'Goblet Squats'],
    restrictions: ['Knee pain', 'Hip impingement'],
  },
  'Goblet Squats': {
    category: 'Lower Body - Squat Pattern',
    type: 'Accessory',
    alternatives: ['Front Squats', 'Box Squats', 'Leg Press'],
    restrictions: ['Shoulder pain', 'Wrist pain'],
  },

  // Main Lifts - Upper Body
  'Floor Press Haltères': {
    category: 'Upper Body - Horizontal Press',
    type: 'Max Effort',
    alternatives: [
      'Bench Press',
      'Incline Press',
      'Push-ups',
      'Dumbbell Bench Press',
    ],
    restrictions: ['Shoulder pain', 'Elbow pain'],
  },
  'Overhead Press': {
    category: 'Upper Body - Vertical Press',
    type: 'Max Effort',
    alternatives: [
      'Push Press',
      'Landmine Press',
      'Incline Press',
      'Arnold Press',
    ],
    restrictions: ['Shoulder impingement', 'Thoracic mobility limitations'],
  },
  'Incline Press': {
    category: 'Upper Body - Incline Press',
    type: 'Max Effort',
    alternatives: ['Overhead Press', 'Landmine Press', 'Incline Push-ups'],
    restrictions: ['Shoulder pain'],
  },

  // Accessory Exercises
  'KB Swings': {
    category: 'Full Body - Hip Hinge',
    type: 'Accessory',
    alternatives: [
      'Cable Pull-throughs',
      'Romanian Deadlifts',
      'Good Mornings',
    ],
    restrictions: ['Lower back pain', 'Shoulder pain'],
  },
  'Face Pulls': {
    category: 'Upper Body - Rear Delt',
    type: 'Prehab',
    alternatives: ['Band Pull-aparts', 'Reverse Flyes', 'Cable Rows (high)'],
    restrictions: [],
  },
  'Farmers Walk': {
    category: 'Full Body - Loaded Carry',
    type: 'GPP',
    alternatives: [
      'Suitcase Carry',
      'Overhead Carry',
      'Yoke Walk',
      'Trap Bar Carry',
    ],
    restrictions: ['Grip weakness', 'Lower back pain'],
  },
  'Bulgarian Split Squats': {
    category: 'Lower Body - Unilateral',
    type: 'Accessory',
    alternatives: ['Reverse Lunges', 'Step-ups', 'Single Leg Press'],
    restrictions: ['Knee pain', 'Balance issues'],
  },
}

/**
 * Get exercise information including alternatives
 * @param {string} exerciseName - Name of the exercise
 * @returns {Object|null} Exercise info or null if not found
 */
function getExerciseInfo(exerciseName) {
  return EXERCISE_DATABASE[exerciseName] || null
}

/**
 * Get alternative exercises for a given exercise
 * @param {string} exerciseName - Name of the exercise to substitute
 * @param {string} reason - Optional reason for substitution (e.g., "shoulder pain")
 * @returns {Array} Array of alternative exercise names
 */
function getAlternatives(exerciseName, reason = null) {
  const exercise = EXERCISE_DATABASE[exerciseName]

  if (!exercise) {
    return []
  }

  let alternatives = [...exercise.alternatives]

  // Filter out alternatives that have the same restriction
  if (reason) {
    alternatives = alternatives.filter((altName) => {
      const altExercise = EXERCISE_DATABASE[altName]
      if (!altExercise) return true
      return !altExercise.restrictions.some((restriction) =>
        restriction.toLowerCase().includes(reason.toLowerCase())
      )
    })
  }

  return alternatives
}

/**
 * Get exercises by category
 * @param {string} category - Exercise category
 * @returns {Array} Array of exercise names in that category
 */
function getExercisesByCategory(category) {
  return Object.entries(EXERCISE_DATABASE)
    .filter(([, info]) => info.category === category)
    .map(([name]) => name)
}

/**
 * Get all categories
 * @returns {Array} Array of unique categories
 */
function getAllCategories() {
  const categories = new Set()
  Object.values(EXERCISE_DATABASE).forEach((info) => {
    categories.add(info.category)
  })
  return Array.from(categories).sort()
}

/**
 * Validate a substitution
 * @param {string} originalExercise - Original exercise name
 * @param {string} substituteExercise - Substitute exercise name
 * @returns {Object} Validation result with isValid and message
 */
function validateSubstitution(originalExercise, substituteExercise) {
  const original = EXERCISE_DATABASE[originalExercise]
  const substitute = EXERCISE_DATABASE[substituteExercise]

  if (!original) {
    return {
      isValid: false,
      message: `Original exercise "${originalExercise}" not found in database`,
    }
  }

  // Check if substitute is in the database
  if (!substitute) {
    return {
      isValid: true,
      message: 'Custom exercise - no validation available',
      warning: 'Make sure this exercise targets similar movement patterns',
    }
  }

  // Check if exercises are in the same category
  if (original.category !== substitute.category) {
    return {
      isValid: true,
      message: 'Warning: Different movement category',
      warning: `Original: ${original.category}, Substitute: ${substitute.category}`,
    }
  }

  // Same category - valid substitution
  return {
    isValid: true,
    message: 'Valid substitution - same category',
  }
}

module.exports = {
  getExerciseInfo,
  getAlternatives,
  getExercisesByCategory,
  getAllCategories,
  validateSubstitution,
  EXERCISE_DATABASE,
}
