---
description: "Task list for Workout Tracker MVP feature implementation"
---

# Tasks: Workout Tracker MVP

**Input**: Design documents from `specs/001-workout-tracker-mvp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

-   **[P]**: Can run in parallel
-   **[Story]**: User story (US1, US2, etc.)
-   File paths are included in descriptions.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

-   [X] T001 Create project structure: `backend/` and `frontend/` directories.
-   [X] T002 Initialize Node.js project in `backend/` with Express.js.
-   [X] T003 Initialize React project in `frontend/` (e.g., using Vite).
-   [X] T004 [P] Configure linting/formatting for both `backend/` and `frontend/`.
-   [X] T005 [P] Install frontend UI/visual dependencies in `frontend/`: Material-UI (MUI), `lottie-react`, `react-player`.
-   [X] T006 [P] Configure MUI theme provider in `frontend/src/App.jsx`.

---

## Phase 2: Program Converter Script (User Story 4)

**Purpose**: Create the script to convert `program.md` to `program.json`.

**⚠️ CRITICAL**: This phase is a prerequisite for any feature that displays program data.

### Tests for User Story 4

-   [X] T007 [P] [US4] Unit test for the Markdown parsing logic to ensure it correctly extracts exercises from a sample text block.
-   [X] T008 [P] [US4] Integration test for the full conversion script, checking if program.md produces a valid `program.json`.

### Implementation for User Story 4

-   [X] T009 [P] [US4] Install and configure `remark` in `backend/`.
-   [X] T010 [US4] Implement parsing logic in `backend/scripts/parser.js` to traverse the Markdown AST and extract program structure.
-   [X] T011 [US4] Implement serialization logic to convert the parsed data into the defined JSON schema.
-   [X] T012 [US4] Create the main converter script `backend/scripts/convert.js` with a command-line interface (e.g., `node convert.js --input <file> --output <file>`).

**Checkpoint**: The `program.json` file can be successfully generated from `program.md`.

---

## Phase 3: Foundational Backend & API (Blocking Prerequisites)

**Purpose**: Core backend infrastructure for handling user data.

-   [X] T013 Setup PostgreSQL database connection in `backend/src/config/`.
-   [X] T014 Implement basic user authentication/authorization.
-   [X] T015 Create database models in `backend/src/models/` for user-specific data: `User`, `WorkoutLog`, `PersonalRecord`.
-   [X] T016 Setup API routing and middleware structure in `backend/src/api/`.
-   [X] T017 Implement a service in `backend/src/services/programService.js` that reads and serves data from `backend/data/program.json`.
-   [X] T018 Configure error handling and logging for the `backend/`.

**Checkpoint**: Backend is ready. API can serve program data and is ready to handle user data.

---

## Phase 4: User Story 1 - View and Log a Workout Session (Priority: P1) 🎯 MVP

**Goal**: Allow the user to view their planned workout and log their performance.

### Tests for User Story 1

-   [X] T019 [P] [US1] Backend integration test for fetching today's workout from the JSON data source.
-   [X] T020 [P] [US1] Backend integration test for logging a workout session to the database.
-   [X] T021 [P] [US1] Frontend integration test for submitting a workout log.

### Implementation for User Story 1

-   [X] T022 [US1] Implement API endpoint to get today's workout (reading from `program.json`) in `backend/src/api/workoutRoutes.js`.
-   [X] T023 [US1] Implement API endpoint to log a workout session (writing to DB) in `backend/src/api/workoutRoutes.js`.
-   [X] T024 [P] [US1] Create `WorkoutDisplay` component in `frontend/src/components/` using MUI.
-   [X] T025 [P] [US1] Create `ExerciseLogForm` component in `frontend/src/components/` using MUI.
-   [X] T026 [P] [US1] Create `LottieAnimation` component in `frontend/src/components/` to display exercise animations.
-   [X] T027 [US1] Implement `TodayWorkout` page in `frontend/src/pages/` that fetches program data and posts log data.
-   [X] T028 [US1] Implement API client for all workout data in `frontend/src/services/apiClient.js`.

**Checkpoint**: User Story 1 is fully functional and testable.

---

## Phase 5: User Story 2 - Track Progress and PRs (Priority: P2)

**Goal**: Allow the user to track progress and view Personal Records.

-   [X] T029 [US2] Implement analytics service for PR detection in `backend/src/services/analyticsService.js`.
-   [X] T030 [US2] Implement API endpoints to retrieve PRs and exercise history in `backend/src/api/analyticsRoutes.js`.
-   [X] T031 [P] [US2] Create `PRDisplay` and `ExerciseHistoryChart` components in `frontend/src/components/`.
-   [X] T032 [US2] Implement `Progress` page in `frontend/src/pages/`.

---

## Phase 6: User Story 3 - Plan and Adapt Workouts (Priority: P3)

**Goal**: Allow the user to view upcoming workouts and substitute exercises.

-   [ ] T033 [US3] Update backend services and API to handle exercise substitutions in workout logs.
-   [ ] T034 [P] [US3] Create `WorkoutCalendar` and `ExerciseSubstitutionModal` components in `frontend/src/components/`.
-   [ ] T035 [US3] Implement `Plan` page in `frontend/src/pages/`.

---

## Phase 7: Polish & Cross-Cutting Concerns

-   [ ] T036 [P] Documentation updates (API, scripts).
-   [ ] T037 Code cleanup and refactoring.
-   [ ] T038 Performance optimization.
-   [ ] T039 [P] Additional unit tests for critical logic.
-   [ ] T040 Security hardening.
