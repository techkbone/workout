const { z } = require('zod');

/**
 * Schema for a single exercise set
 */
const exerciseSetSchema = z.object({
  weight: z.number().nonnegative('Weight must be non-negative'),
  reps: z.number().int().positive('Reps must be a positive integer'),
  rpe: z.number().min(1).max(10).optional(), // Rate of Perceived Exertion (1-10)
  tempo: z.string().optional(), // e.g., "3-0-1-0"
  rest: z.number().nonnegative().optional(), // Rest time in seconds
  notes: z.string().optional()
});

/**
 * Schema for an exercise within a workout
 */
const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.array(exerciseSetSchema).min(1, 'At least one set is required'),
  category: z.string().optional(),
  completed: z.boolean().default(true)
});

/**
 * Schema for workout log creation
 */
const createWorkoutLogSchema = z.object({
  sessionId: z.string().optional(),
  date: z.string().datetime().or(z.date()),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
  notes: z.string().optional(),
  substitutions: z.record(z.string()).optional(), // { originalExercise: substituteExercise }
  duration: z.number().nonnegative().optional(), // Workout duration in minutes
  rating: z.number().min(1).max(5).optional() // User's workout rating (1-5 stars)
});

/**
 * Schema for workout log query parameters
 */
const workoutLogQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  exercise: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().nonnegative().default(0)
});

/**
 * Schema for date query parameter
 */
const dateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
});

/**
 * Schema for exercise substitution validation
 */
const substitutionValidationSchema = z.object({
  originalExercise: z.string().min(1, 'Original exercise is required'),
  substituteExercise: z.string().min(1, 'Substitute exercise is required'),
  reason: z.string().optional()
});

/**
 * Schema for personal record
 */
const personalRecordSchema = z.object({
  exerciseName: z.string().min(1, 'Exercise name is required'),
  weight: z.number().positive('Weight must be positive'),
  reps: z.number().int().positive('Reps must be a positive integer'),
  date: z.string().datetime().or(z.date()).optional()
});

/**
 * Validate and parse request data
 * @param {Object} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} Validated and parsed data
 * @throws {z.ZodError} If validation fails
 */
function validateData(schema, data) {
  return schema.parse(data);
}

/**
 * Validate data safely, returning validation result
 * @param {Object} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} { success: boolean, data?: Object, error?: Object }
 */
function validateDataSafe(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.format() };
}

module.exports = {
  exerciseSetSchema,
  exerciseSchema,
  createWorkoutLogSchema,
  workoutLogQuerySchema,
  dateQuerySchema,
  substitutionValidationSchema,
  personalRecordSchema,
  validateData,
  validateDataSafe
};
