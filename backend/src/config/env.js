const { z } = require('zod');

/**
 * Environment configuration schema with Zod validation
 * This ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default('workout_tracker'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().min(1, 'Database password is required'),

  // Server
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Connection Pool
  DB_POOL_MIN: z.coerce.number().int().nonnegative().default(2),
  DB_POOL_MAX: z.coerce.number().int().positive().default(10),
  DB_POOL_IDLE_TIMEOUT: z.coerce.number().int().positive().default(10000),

  // API
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  API_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),

  // JWT Authentication
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Frontend
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  // Program data path
  PROGRAM_JSON_PATH: z.string().default('data/program.json')
});

/**
 * Validate and parse environment variables
 * Throws an error if validation fails
 */
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Invalid environment configuration');
    }
    throw error;
  }
}

// For development: allow running without full env config
function getEnvSafe() {
  try {
    return validateEnv();
  } catch (error) {
    console.warn('⚠️  Using default configuration. Set environment variables for production.');
    // Return safe defaults for development
    return {
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
      DB_NAME: process.env.DB_NAME || 'workout_tracker',
      DB_USER: process.env.DB_USER || 'postgres',
      DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
      PORT: parseInt(process.env.PORT, 10) || 3001,
      NODE_ENV: process.env.NODE_ENV || 'development',
      DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN, 10) || 2,
      DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX, 10) || 10,
      DB_POOL_IDLE_TIMEOUT: parseInt(process.env.DB_POOL_IDLE_TIMEOUT, 10) || 10000,
      API_RATE_LIMIT_WINDOW_MS: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS, 10) || 900000,
      API_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS, 10) || 100,
      CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
      JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production-at-least-32-chars',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
      PROGRAM_JSON_PATH: process.env.PROGRAM_JSON_PATH || 'data/program.json'
    };
  }
}

module.exports = {
  validateEnv,
  getEnvSafe,
  env: getEnvSafe()
};
