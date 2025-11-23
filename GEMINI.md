# GEMINI.md

This file provides guidance to the Gemini AI agent when working with the code in this repository.

## Project Overview

This is a full-stack workout tracking web application designed to manage and track a specific Westside Conjugate Method rugby training program. The application allows a user to log workouts, track progress against a detailed plan, view Personal Records (PRs), and adapt the training plan with exercise substitutions.

The core of the application is a data-driven architecture where a detailed training program, written in Markdown (`program.md`), is parsed and converted into a JSON structure. This JSON serves as the source of truth for the workout schedule and exercises, while all user-generated data (workout logs, PRs) is stored in a PostgreSQL database.

## Architecture

The project is a monorepo containing a separate frontend and backend.

-   **Backend**: A Node.js/Express API server running on port `3001`. It handles business logic, data processing, and communication with the PostgreSQL database.
-   **Frontend**: A React 18 application built with Vite and using Material-UI for the component library. It runs on port `5173` and communicates with the backend API.

### Data Flow

1.  **Program Definition**: The entire 6-month training plan is detailed in `program.md`.
2.  **Conversion**: A script (`backend/scripts/convert.js`) parses `program.md` and generates `backend/data/program.json`. This JSON file is the static source of truth for the program structure.
3.  **API Layer**: The backend's `programService.js` reads the `program.json` file to serve the planned workouts to the frontend.
4.  **User Data**: The frontend sends user-generated workout logs and other data to the backend, which stores it in the PostgreSQL database.

## Database

-   **Engine**: PostgreSQL
-   **Schema**: The complete database schema, including tables for `users`, `workout_logs`, and `personal_records`, is defined in `backend/db/schema.sql`.
-   **Setup**: To initialize the database, first create the database and then run the schema file against it.
    ```bash
    createdb workout_tracker
    psql -d workout_tracker -f backend/db/schema.sql
    ```

## Getting Started

Follow these steps to set up and run the application locally.

### 1. Prerequisites

-   Node.js
-   PostgreSQL server running locally.

### 2. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Set up environment variables. Create a .env file from the example.
cp .env.example .env

# 4. IMPORTANT: Edit the .env file with your PostgreSQL connection details.
# The default database name is 'workout_tracker' if you followed the DB setup.
# Example .env content:
# DB_USER=your_postgres_user
# DB_HOST=localhost
# DB_NAME=workout_tracker
# DB_PASSWORD=your_postgres_password
# DB_PORT=5432
# PORT=3001

# 5. Convert the program file (one-time setup)
node scripts/convert.js --input ../program.md --output data/program.json

# 6. Start the backend server
npm start
# The API will be running at http://localhost:3001
```

### 3. Frontend Setup

```bash
# 1. In a new terminal, navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the frontend development server
npm run dev
# The application will be running at http://localhost:5173
```

## Development Conventions

### API Authentication

All backend API endpoints require a user ID to be passed in the `x-user-id` header for authentication. The `apiClient.js` service on the frontend handles this.

### Code Style & Formatting

-   **Formatting**: Both frontend and backend use Prettier for code formatting. Run `npm run format` in the respective directory to format the code.
-   **Linting**: The frontend uses ESLint for code analysis. Run `npm run lint` in the `frontend` directory to check for issues.

### Testing

-   **Backend**: Uses Jest for unit and integration tests. Run tests from the `backend` directory.
    ```bash
    npm test
    ```
-   **Frontend**: Uses Vitest and React Testing Library. Run tests from the `frontend` directory.
    ```bash
    npm test
    ```

## Project Structure

### Backend (`backend/`)

```
├── data/
│   └── program.json          # Generated: The structured workout program data
├── db/
│   ├── README.md             # Database setup instructions
│   └── schema.sql            # PostgreSQL database schema
├── scripts/
│   ├── convert.js            # CLI tool to convert program.md → program.json
│   └── parser.js             # Remark-based Markdown parser logic
├── src/
│   ├── index.js              # Express server entry point
│   ├── config/
│   │   └── database.js       # PostgreSQL connection pool configuration
│   ├── api/
│   │   ├── routes/           # API route definitions (workouts, analytics, etc.)
│   │   └── middleware/       # Express middleware (auth, error handling, logging)
│   ├── models/               # Database models (User, WorkoutLog, PersonalRecord)
│   └── services/             # Business logic (program parsing, analytics calculations)
└── tests/
    ├── unit/                 # Unit tests
    └── integration/          # API integration tests
```

### Frontend (`frontend/`)

```
├── src/
│   ├── main.jsx              # React application entry point
│   ├── App.jsx               # Root component with page navigation
│   ├── pages/
│   │   ├── TodayWorkout.jsx  # Main page for viewing and logging a workout
│   │   ├── Plan.jsx          # Calendar view for planning and substitutions
│   │   └── Progress.jsx      # Analytics and progress visualization page
│   ├── components/           # Reusable UI components (charts, forms, modals)
│   └── services/
│       └── apiClient.js      # Centralized functions for backend API communication
└── vite.config.js            # Vite and Vitest configuration
```
