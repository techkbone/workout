const { Pool } = require('pg')

// TODO: Replace with environment variables
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'workout',
  password: 'password',
  port: 5432,
})

module.exports = pool
