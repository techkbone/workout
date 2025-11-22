# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a workout tracking web application designed to manage and track a specific Westside Conjugate Method rugby training program for a Masters athlete (38 years old). The application allows logging workouts, tracking progress, viewing Personal Records (PRs), and adapting the training plan based on the detailed program in `program.md`.

The project follows a data-driven architecture where the training program is converted from Markdown to JSON, which serves as the source of truth for workout structure. User-generated data (logs, PRs, notes) is stored in PostgreSQL.

## Architecture

### Monorepo Structure

- **Backend** (`backend/`): Node.js/Express API server (port 3001)
- **Frontend** (`frontend/`): React 18 + Vite application with Material-UI

### Key Architectural Decisions

1. **Program Data Flow**: `program.md` → conversion script → `program.json` → API → Frontend
2. **Data Separation**:
   - Static program structure lives in `backend/data/program.json` (generated, gitignored)
   - User data (logs, PRs) lives in PostgreSQL database
3. **Markdown Parser**: Uses `remark` library to parse structured workout program from Markdown
4. **UI Libraries**: Material-UI for components, Lottie for exercise animations, React Player for video fallback

## Common Commands

### Development

```bash
# Start backend server
cd backend
npm start                    # Runs on http://localhost:3001

# Start frontend dev server
cd frontend
npm run dev                  # Runs on http://localhost:5173 (Vite default)

# Run tests
cd backend
npm test                     # Jest tests

cd frontend
npm test                     # Vitest tests
```

### Program Conversion

```bash
# Convert program.md to program.json
cd backend
node scripts/convert.js --input ../program.md --output data/program.json
```

### Code Quality

```bash
# Format code (both backend and frontend)
npm run format              # Prettier

# Lint frontend
cd frontend
npm run lint                # ESLint
```

### Building

```bash
# Build frontend for production
cd frontend
npm run build               # Creates dist/ directory
npm run preview             # Preview production build
```

## Core Concepts

### Westside Conjugate Method

The training program implements the Westside Conjugate Method with specific patterns:

- **Max Effort (ME)**: Work up to 1-3RM at 90%+ intensity, rotated every 1-3 weeks
- **Dynamic Effort (DE)**: Speed work with 10x2 or 9x3 sets at 60-75%, focused on bar velocity
- **Pattern**: ABAB weekly rotation (e.g., Week A: DE Lower, ME Upper, ME Lower; Week B: ME Lower, DE Upper, DE Lower)
- **Waves**: 3-week progression cycles for Dynamic Effort (e.g., 65% → 70% → 75%)
- **Deload**: Mandatory week 4 of each phase (-30% volume, -10% intensity)

### Data Model Key Entities

- **Program**: Overall 6-month training plan with phases
- **Phase**: Training block (e.g., "Phase 1 — Base Force") containing weeks
- **WorkoutSession**: Specific planned workout for a date with exercises
- **ExerciseInstance**: Exercise within a session with prescribed sets/reps/weight
- **WorkoutLog**: User's actual performance record (stored in DB)
- **PersonalRecord**: Tracked PRs for main lifts (stored in DB)

### Constitution Principles

The project follows five core principles defined in `.specify/memory/constitution.md`:

1. **Data-Driven Workouts**: Track all metrics from program.md (sets, reps, RPE, weights, notes)
2. **Progression and Analytics**: Visualize progress with charts and 1RM estimates
3. **User-Centric Interface**: Fast, simple mobile-friendly UI for use during workouts
4. **Flexibility and Adaptability**: Allow exercise substitutions and plan modifications
5. **Focus on Key Lifts**: Highlight ME/DE days and track PRs on main movements

## File Structure Guide

### Backend Important Files

```
backend/
├── scripts/
│   ├── convert.js          # CLI tool to convert program.md → program.json
│   └── parser.js           # Remark-based Markdown parser
├── src/
│   ├── index.js            # Express server entry point
│   ├── config/
│   │   └── database.js     # PostgreSQL pool configuration
│   ├── api/
│   │   ├── routes/
│   │   │   ├── index.js    # Main API router
│   │   │   └── workoutRoutes.js  # Workout endpoints (/api/workouts)
│   │   └── middleware/
│   │       ├── auth.js     # Basic authentication
│   │       ├── logger.js   # Request logging
│   │       └── errorHandler.js
│   ├── models/             # Database models (User, WorkoutLog, PersonalRecord)
│   └── services/
│       └── programService.js  # Reads/caches program.json data
└── tests/
    ├── unit/               # Parser unit tests
    └── integration/        # API integration tests
```

### Frontend Important Files

```
frontend/
├── src/
│   ├── main.jsx            # React app entry point
│   ├── App.jsx             # Root component (currently just renders TodayWorkout)
│   ├── pages/
│   │   └── TodayWorkout.jsx    # Main workout logging page
│   ├── components/
│   │   ├── WorkoutDisplay.jsx   # Displays planned workout
│   │   ├── ExerciseLogForm.jsx  # Form to log set performance
│   │   └── LottieAnimation.jsx  # Exercise animation component
│   └── services/
│       └── apiClient.js    # Backend API communication
└── index.html              # Vite entry HTML
```

### Project Root Files

- **program.md**: Source workout program (French, detailed 6-month plan)
- **specs/001-workout-tracker-mvp/**: Feature specification with spec, plan, and tasks
- **.specify/**: Speckit framework files (templates, constitution, scripts)
- **.gemini/**: Gemini AI commands (alternative AI workflow)

## API Endpoints

### Current Implementation

- `GET /api/` - Health check ("API is running")
- `GET /api/workouts/today` - Get today's planned workout from program.json
- `POST /api/workouts/log` - Log completed workout to database

Both workout endpoints require basic authentication (see `backend/src/api/middleware/auth.js`).

### Planned Endpoints

- Analytics routes for PRs and exercise history (see tasks.md Phase 5)
- Exercise substitution support (see tasks.md Phase 6)

## Development Workflow

### Task Tracking

Tasks are managed in `specs/001-workout-tracker-mvp/tasks.md` following the Speckit framework:
- Tasks marked with `[X]` are complete
- Tasks organized by phase and user story (US1, US2, US3, US4)
- `[P]` indicates parallelizable tasks
- Current status: Phase 4 mostly complete (User Story 1 - View and Log Workout)

### Testing Strategy

- **Backend**: Jest + Supertest for unit and integration tests
- **Frontend**: Vitest + React Testing Library
- **Test files**: Co-located with source or in `tests/` directories
- Tests should validate against user stories in `specs/001-workout-tracker-mvp/spec.md`

### Adding New Features

1. Check if it aligns with constitution principles in `.specify/memory/constitution.md`
2. Reference user stories in `specs/001-workout-tracker-mvp/spec.md`
3. Update tasks in `specs/001-workout-tracker-mvp/tasks.md`
4. Implement with tests following existing patterns

## Special Considerations

### Injury Constraints

The user has specific physical constraints mentioned in program.md:
- Post-labrum shoulder surgery (10 years ago) - avoid overhead work behind frontal plane
- Recovered hip injury - requires daily mobility work
- Masters athlete (38 years) - deload weeks are non-negotiable

### Program Parsing Complexity

The `program.md` file has complex nested structure:
- Phases with weeks
- Weeks with dated sessions (e.g., "Lundi 25 Nov")
- Sessions with multiple exercise types (Main Movements, Accessoires, Core, etc.)
- Exercise parameters: sets × reps @ weight, RPE, rest times, tempo, notes

The parser in `backend/scripts/parser.js` uses remark to traverse this structure. When modifying, ensure all parameters are captured.

### Mobile-First UI

The application is designed to be used on a phone during workouts:
- Forms should be simple and fast to fill
- Touch targets should be large
- Minimize text input where possible
- Material-UI components should be configured for mobile responsiveness

## Dependencies Notes

### Backend Key Dependencies

- `express@^5.1.0` - Web framework (note: v5.x)
- `pg@^8.16.3` - PostgreSQL driver
- `remark@^15.0.1` - Markdown parser
- `unist-util-visit@^5.0.0` - AST traversal for Markdown parsing

### Frontend Key Dependencies

- `react@^18.2.0` - UI framework
- `@mui/material@^7.3.5` - Component library
- `lottie-react@^2.4.1` - Animation playback
- `react-player@^3.4.0` - Video playback fallback
- `vite@^4.4.5` - Build tool and dev server

## Database Schema

PostgreSQL configuration is in `backend/src/config/database.js` (currently hardcoded, should use env vars).

Models exist for:
- `User` - User authentication
- `WorkoutLog` - Logged workout sessions
- `PersonalRecord` - Tracked PRs

See `backend/src/models/` for implementation details. Schema details should be documented in `specs/001-workout-tracker-mvp/data-model.md` (to be created).

## Language and Localization

- Program content is in French (program.md is in French)
- UI strings are currently English
- Consider internationalization if expanding scope
