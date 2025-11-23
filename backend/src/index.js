const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3001

const { logger } = require('./api/middleware/logger')
const { errorHandler } = require('./api/middleware/errorHandler')
const apiRouter = require('./api/routes')

// Security middleware
app.use(helmet()) // Adds security headers

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs:
    parseInt(process.env.API_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS, 10) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

// Body parsing middleware
app.use(express.json({ limit: '1mb' })) // Limit payload size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Logging middleware
app.use(logger)

// API routes
app.use('/api', apiRouter)

// Error handling middleware (must be last)
app.use(errorHandler)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`)
  })
}

module.exports = app
