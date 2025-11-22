const pool = require('../config/database')

async function createUser(username, passwordHash) {
  const res = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
    [username, passwordHash]
  )
  return res.rows[0]
}

async function findUserByUsername(username) {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ])
  return res.rows[0]
}

module.exports = {
  createUser,
  findUserByUsername,
}
