# Implementation Plan: Workout Tracker MVP

**Branch**: `001-workout-tracker-mvp` | **Date**: 2025-11-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-workout-tracker-mvp/spec.md`

## Summary

This plan outlines the technical approach for building the Workout Tracker MVP. The architecture is designed as a reusable platform. A key component is a standalone backend script that converts a training program from a structured Markdown file into a canonical `program.json` file.

The main application will then use this JSON file as the source of truth for the program structure, making the platform data-driven and decoupled from the Markdown format. The goal is to create a web application that allows a user to view their imported daily workouts, log performance, and track progress. The project will be structured as a standard web application with separate `frontend` and `backend` directories.

## Technical Context

**Language/Version**: Node.js 20.x (Backend), JavaScript (ES2022) with React 18 (Frontend)
**Primary Dependencies**:
-   **Backend**: Express.js, `pg` (PostgreSQL driver), `remark` (for Markdown parsing)
-   **Frontend**: React, Material-UI (MUI), Lottie (`lottie-react`), React Player
**Storage**:
-   **Program Structure**: `program.json` file (generated from Markdown)
-   **User Data**: PostgreSQL (for workout logs, PRs, user accounts, etc.)
**Testing**: Jest & Supertest (Backend), React Testing Library (Frontend)
**Target Platform**: Web Browser (desktop and mobile)
**Project Type**: Web application
**Performance Goals**: UI interactions should feel instant (<150ms). Data logging API calls should complete in under 300ms.
**Constraints**: The user interface must be highly usable on a mobile device's browser, as it will be used during workouts.
**Scale/Scope**: Single-user application.

### UI & Visuals
To meet the goal of a dynamic and inspiring interface with exercise demonstrations, the following libraries will be used:
-   **Material-UI (MUI)**: For a comprehensive set of modern and responsive UI components.
-   **Lottie (`lottie-react`)**: As the primary method for displaying lightweight, high-quality exercise animations.
-   **React Player**: As a fallback for displaying actual video files when necessary.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

-   ✅ **I. Data-Driven Workouts**: The plan includes a PostgreSQL database with a schema designed to capture all details from `program.md` (phases, sessions, exercises, sets, reps, RPE, etc.).
-   ✅ **II. Progression and Analytics**: The backend will have dedicated API endpoints for querying historical data, and the frontend will include components for charting and displaying PRs.
-   ✅ **III. User-Centric and Simple Interface**: The frontend will be built with a component-based architecture focused on creating a simple, fast, and intuitive workflow for logging workouts.
-   ✅ **IV. Flexibility and Adaptability**: The API and database schema will support substituting exercises within a workout session.
-   ✅ **V. Focus on Key Lifts and Metrics**: The `exercises` table in the database will include fields to categorize exercises (e.g., `type: 'Max Effort'`) to allow for special tracking and display.

## Project Structure

### Documentation (this feature)

```text
specs/001-workout-tracker-mvp/
├── spec.md              # The feature specification (already created)
├── plan.md              # This file
├── research.md          # To be created if needed
├── data-model.md        # To be created
├── quickstart.md        # To be created
├── contracts/           # To be created (for API contracts)
└── tasks.md             # To be created
```

### Source Code (repository root)

```text
# Web application structure
backend/
├── data/                # To store the generated program.json
├── src/
│   ├── api/             # Express routes and controllers
│   ├── models/          # Database interaction logic for user data
│   ├── services/        # Business logic
│   └── config/          # Configuration files
├── scripts/             # Standalone scripts (e.g., the program converter)
└── tests/
    ├── integration/
    └── unit/

frontend/
├── src/
│   ├── components/      # Reusable React components (e.g., Button, ExerciseCard)
│   ├── pages/           # Top-level page components (e.g., TodayWorkout, Progress)
│   ├── services/        # API client for communicating with the backend
│   └── state/           # State management (e.g., React Context or Zustand)
└── tests/
```

**Structure Decision**: A standard monorepo with two separate packages, `backend` and `frontend`, is chosen. This provides a clear separation of concerns between the API and the user interface, while keeping all project code in a single repository for easy management.

## Complexity Tracking

> No violations of the constitution were identified. This section is not needed.
