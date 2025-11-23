# 🏋️ Workout Tracker - Westside Conjugate Method

A full-stack web application for tracking and managing a Westside Conjugate Method rugby training program. Built with React, Node.js/Express, and PostgreSQL, now using **Excel as the source of truth** for program data.

![CI/CD](https://github.com/yourusername/workout-tracker/workflows/CI%2FCD%20Pipeline/badge.svg)

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Development Setup](#development-setup)
- [Excel Program Format](#excel-program-format)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- 📅 **Daily Workout Tracking**: View and log today's planned workout
- 📊 **Progress Analytics**: Track PRs, 1RM estimates, and performance trends
- 🔄 **Exercise Substitution**: Substitute exercises based on injuries or equipment availability
- 📈 **Visual Progress Charts**: Recharts-based visualizations of workout progression
- 📚 **Exercise Library**: 26+ exercises with categories, equipment, and technical notes

### Training Program Management
- **Excel-Based Program**: Uses `Programme_Westside_Rugby_Masters_2025-2026.xlsx` as source of truth
- **Westside Conjugate Method**: Max Effort, Dynamic Effort, and Accessory work
- **6 Training Phases**: Phase 0 (Return) through Phase 5 (Competition)
- **73 Planned Sessions**: Complete 6-month training calendar

### Technical Features
- ✅ **Zod Validation**: Type-safe data validation on backend and frontend
- 🐳 **Docker Support**: Full containerization with docker-compose
- 🔄 **Retry Logic**: Exponential backoff for failed API requests
- 🛡️ **Error Boundaries**: Graceful error handling in React
- 🔧 **Environment Configuration**: Validated env vars with sensible defaults
- 🚀 **CI/CD Pipeline**: GitHub Actions for automated testing and deployment

## 🏗️ Architecture

### Monorepo Structure
```
workout/
├── backend/              # Node.js/Express API (port 3001)
│   ├── src/
│   │   ├── api/         # Routes and middleware
│   │   ├── config/      # DB and env configuration
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── validators/  # Zod schemas
│   ├── scripts/         # Excel parser and conversion
│   ├── data/            # Generated program.json
│   └── db/              # Database schema
├── frontend/            # React 18 + Vite (port 5173)
│   └── src/
│       ├── components/  # Reusable React components
│       ├── pages/       # Page components
│       └── services/    # API client with retry logic
└── Programme_Westside_Rugby_Masters_2025-2026.xlsx  # Source of truth
```

### Data Flow
```
Excel File → Conversion Script → program.json → API → React UI
                                      ↓
                                  PostgreSQL (User Data: logs, PRs)
```

## 📦 Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Node.js 18+**
- **PostgreSQL 15+** (if not using Docker)
- **npm** or **pnpm**

## 🚀 Quick Start with Docker

The fastest way to get started:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd workout

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and set your database password
nano .env  # or your preferred editor

# 4. Start all services (development mode)
docker-compose --profile dev up -d

# 5. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# PostgreSQL: localhost:5432
```

### Docker Commands

```bash
# Start in development mode (hot reload)
docker-compose --profile dev up

# Start in production mode (optimized builds)
docker-compose --profile prod up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend-dev

# Rebuild after code changes
docker-compose build
docker-compose up -d

# Run database migrations
docker-compose exec postgres psql -U postgres -d workout_tracker -f /docker-entrypoint-initdb.d/schema.sql
```

## 💻 Development Setup (Without Docker)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup PostgreSQL Database

```bash
# Create database
createdb workout_tracker

# Run schema
psql -d workout_tracker -f backend/db/schema.sql
```

### 3. Configure Environment

```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit with your database credentials
nano backend/.env
```

### 4. Convert Excel Program to JSON

```bash
cd backend
node scripts/convert.js --input ../Programme_Westside_Rugby_Masters_2025-2026.xlsx --output data/program.json
```

### 5. Start Development Servers

```bash
# Terminal 1: Backend (http://localhost:3001)
cd backend
npm start

# Terminal 2: Frontend (http://localhost:5173)
cd frontend
npm run dev
```

## 📊 Excel Program Format

The application reads workout programs from Excel files with this structure:

### Required Sheets

1. **Programme Complet** - Main workout schedule
   - Columns: Date, Sem, Phase, Jour, Type Séance, Exercice Principal, Sets×Reps, Charge, RPE, etc.

2. **Aperçu Phases** - Phase overview
   - Phase metadata: objectives, intensities, dates

3. **Bibliothèque Exercices** - Exercise library
   - Exercise catalog with categories, equipment, technical notes

4. **Suivi PRs** - PR tracking (optional template)

### Updating the Program

```bash
# 1. Edit the Excel file
open Programme_Westside_Rugby_Masters_2025-2026.xlsx

# 2. Regenerate program.json
cd backend
node scripts/convert.js --input ../Programme_Westside_Rugby_Masters_2025-2026.xlsx --output data/program.json

# 3. Restart backend to reload data
npm start  # or docker-compose restart backend
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Workouts
```
GET  /workouts/today?date=YYYY-MM-DD  # Get today's workout
POST /workouts/log                     # Log a workout
GET  /workouts/logs                    # Get workout history
GET  /workouts/planned                 # Get all planned workouts
```

#### Analytics
```
GET /analytics/prs?exercise=NAME              # Get personal records
GET /analytics/exercise-history/:name?limit=N # Get exercise history
GET /analytics/progress/:name?days=90         # Get progress analytics
```

#### Exercise Substitutions
```
GET  /substitutions/alternatives/:name?reason=REASON  # Get alternatives
POST /substitutions/validate                          # Validate substitution
GET  /substitutions/categories                        # Get all categories
```

### Request/Response Examples

**Get Today's Workout:**
```bash
curl -H "x-user-id: 1" http://localhost:3001/api/workouts/today
```

**Log a Workout:**
```bash
curl -X POST -H "Content-Type: application/json" -H "x-user-id: 1" \
  -d '{
    "date": "2025-11-25",
    "exercises": [
      {
        "name": "Box Squat",
        "sets": [
          {"weight": 100, "reps": 2, "rpe": 7}
        ]
      }
    ]
  }' \
  http://localhost:3001/api/workouts/log
```

## 🧪 Testing

### Run All Tests

```bash
# Backend tests (Jest)
cd backend
npm test

# Frontend tests (Vitest)
cd frontend
npm test

# Run with coverage
npm test -- --coverage
```

### CI/CD Pipeline

The project uses GitHub Actions for automated testing:
- Runs on every push and pull request
- Tests backend and frontend separately
- Builds Docker images
- Security audits
- (Optional) Automatic deployment on main branch

## 🚀 Deployment

### Production Deployment with Docker

```bash
# 1. Set production environment variables
cp .env.example .env
nano .env
# Set NODE_ENV=production, strong DB_PASSWORD, etc.

# 2. Build and start production containers
docker-compose --profile prod up -d

# 3. Frontend will be available on port 80
# Backend API on port 3001
```

### Environment Variables (Production)

**Critical variables to set:**
```bash
NODE_ENV=production
DB_PASSWORD=<strong-password>
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Reverse Proxy (Nginx/Caddy)

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;  # Frontend container
    }

    location /api {
        proxy_pass http://localhost:3001;  # Backend container
    }
}
```

## 📁 Project Structure

```
workout/
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── middleware/        # Auth, validation, error handling
│   │   │   └── routes/            # API route handlers
│   │   ├── config/
│   │   │   ├── database.js        # PostgreSQL connection
│   │   │   └── env.js             # Validated environment config
│   │   ├── models/                # DB models (User, WorkoutLog, PR)
│   │   ├── services/              # Business logic
│   │   │   ├── programService.js  # Read/cache program.json
│   │   │   ├── analyticsService.js # PR detection, 1RM calc
│   │   │   └── substitutionService.js
│   │   └── validators/            # Zod validation schemas
│   ├── scripts/
│   │   ├── excelParser.js         # Excel → JSON parser
│   │   ├── convert.js             # CLI conversion tool
│   │   └── analyzeExcel.js        # Excel structure analyzer
│   ├── db/
│   │   └── schema.sql             # PostgreSQL schema
│   ├── tests/                     # Jest tests
│   ├── Dockerfile                 # Backend Docker image
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx  # React error boundary
│   │   │   ├── WorkoutDisplay.jsx
│   │   │   ├── ExerciseLogForm.jsx
│   │   │   ├── PRDisplay.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── TodayWorkout.jsx   # Main workout logging
│   │   │   ├── Progress.jsx       # Analytics dashboard
│   │   │   └── Plan.jsx           # Calendar & substitutions
│   │   ├── services/
│   │   │   └── apiClient.js       # API client with retry logic
│   │   ├── App.jsx                # Root component
│   │   └── main.jsx               # Entry point
│   ├── Dockerfile                 # Frontend Docker image (multi-stage)
│   └── package.json
├── docker-compose.yml             # Orchestrates all services
├── .env.example                   # Environment template
├── Programme_Westside_Rugby_Masters_2025-2026.xlsx  # Source of truth
└── README.md
```

## 🔧 Configuration Files

### Key Configuration Files

- **`.env`**: Environment variables (DB credentials, API keys, etc.)
- **`docker-compose.yml`**: Service orchestration
- **`backend/src/config/env.js`**: Validated environment configuration
- **`backend/src/validators/workoutSchemas.js`**: Zod validation schemas
- **`.github/workflows/ci.yml`**: CI/CD pipeline

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes and test
   ```bash
   npm test
   npm run lint
   ```

3. Commit with descriptive message
   ```bash
   git commit -m "feat: add exercise substitution validation"
   ```

4. Push and create PR
   ```bash
   git push origin feature/my-feature
   ```

### Code Style

- **Backend**: CommonJS modules, Prettier formatting
- **Frontend**: ES Modules, ESLint + Prettier
- **Tests**: Jest (backend), Vitest (frontend)

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `test:` Adding/updating tests

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

- **Westside Barbell** for the Conjugate Method training system
- **Louis Simmons** for pioneering Westside methodology
- **Material-UI** for the excellent React component library
- **Recharts** for data visualization

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: [your-email]
- Documentation: [link to docs]

---

**Built with ❤️ for rugby athletes using the Westside Conjugate Method**
