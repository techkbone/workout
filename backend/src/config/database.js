const { Pool } = require('pg');
const { env } = require('./env');

/**
 * PostgreSQL connection pool with validated environment configuration
 * Uses connection pooling for better performance
 */
const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
  // Connection pool settings for performance
  min: env.DB_POOL_MIN,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT,
  // Additional production settings
  connectionTimeoutMillis: 5000, // 5 seconds to establish connection
  statement_timeout: 30000, // 30 seconds max query time
});

// Error handling for pool - log but don't crash in production
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  if (env.NODE_ENV === 'development') {
    console.error('Client info:', client);
  }
  // In production, we might want to alert monitoring instead of exiting
  if (env.NODE_ENV === 'development') {
    process.exit(-1);
  }
});

// Connection event for debugging
pool.on('connect', (client) => {
  if (env.NODE_ENV === 'development') {
    console.log('📊 New database client connected');
  }
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection established successfully');
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

module.exports = pool;
