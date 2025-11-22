const express = require('express')
const app = express()
const port = 3001 // Changed to 3001 to avoid potential conflicts with frontend dev server

const { logger } = require('./api/middleware/logger')
const { errorHandler } = require('./api/middleware/errorHandler')
const apiRouter = require('./api/routes')

app.use(express.json())
app.use(logger)
app.use('/api', apiRouter)
app.use(errorHandler)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`)
  })
}

module.exports = app
