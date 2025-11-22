# Feature Specification: Workout Tracker MVP

**Feature Branch**: `001-workout-tracker-mvp`
**Created**: 2025-11-21
**Status**: Draft
**Input**: User description: "j'aimerai faire une platforme pour faire la gestion et le suivi de mon plan d'entrainement qui est présent dans le fichier program.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Log a Workout Session (Priority: P1)

As a user, I want to see my planned workout for the current day, exactly as detailed in `program.md`. This includes the session type (e.g., Max Effort Upper), all exercises, their prescribed sets, reps, weights, rest times, and any specific notes. I then want to log my actual performance against this plan, recording the actual weight, reps, and RPE for each set. I also need to be able to add notes to any exercise or the session as a whole.

**Why this priority**: This is the absolute core functionality. Without the ability to view and log workouts, the application has no purpose.

**Independent Test**: A user can launch the app, see today's workout, fill in the results for every set, add a note, and save the session. The saved log must be viewable and accurately reflect the input.

**Acceptance Scenarios**:

1.  **Given** it is "Lundi 30 Déc", **When** I open the app, **Then** I see the "Dynamic Effort Lower" workout, including "Box Squats Speed" with "10 × 2 @ ~45 kg".
2.  **Given** I am viewing the "Box Squats Speed" exercise, **When** I complete a set with 50 kg for 2 reps, **Then** I can input "50 kg" and "2 reps" for that set.
3.  **Given** I have completed my workout, **When** I save the session, **Then** a new workout log is created with the date and all the data I entered.

---

### User Story 2 - Track Progress and PRs (Priority: P2)

As a user, I want the application to automatically track my progress. It should identify and save my Personal Records (PRs) for key lifts (e.g., 1RM, 3RM, 5RM) based on my logged workouts. I also want to be able to select any exercise and view my performance history for it over time, ideally as a chart, to see if I am progressing according to the goals in `program.md`.

**Why this priority**: The main goal of the program is to increase strength. Tracking progress and PRs is the primary way to measure the program's success and maintain motivation.

**Independent Test**: After logging a workout that includes a new 3RM on "Floor Press Haltères", the PR page/dashboard is updated with the new record. Navigating to the "Floor Press Haltères" history page displays a chart showing the weight lifted over the last few months.

**Acceptance Scenarios**:

1.  **Given** my previous best 3RM on Floor Press was 45 lbs, **When** I log a successful set of 3 reps at 50 lbs, **Then** the system updates my 3RM PR to 50 lbs.
2.  **Given** I have logged 4 weeks of "Trap Bar Deadlift" workouts, **When** I view the history for that exercise, **Then** I see a chart plotting the estimated 1RM or max weight lifted over those 4 weeks.

---

### User Story 3 - Plan and Adapt Workouts (Priority: P3)

As a user, I want to be able to look ahead at my training schedule to see upcoming workouts, weeks, and phases. Crucially, I need the flexibility to adapt my training. If a planned exercise causes pain or I don't have the right equipment, I must be able to substitute it for a similar one, as suggested in the "Modifications Possibles" section of `program.md`.

**Why this priority**: Adherence to a long-term plan requires flexibility. This feature ensures the user can stay on track even when facing minor obstacles like pain or equipment issues.

**Independent Test**: A user can navigate to a future date and see the planned workout. In a planned session, the user can swap the "Overhead Press" exercise with "Incline Press" and log their performance for the new exercise.

**Acceptance Scenarios**:

1.  **Given** I am viewing next week's workout, **When** I select the "Overhead Press" and choose to substitute it, **Then** I am presented with a list of alternative "Upper Body Press" exercises.
2.  **Given** I have substituted an exercise, **When** I save the workout log, **Then** the log correctly records the substituted exercise and my performance on it.

---

### User Story 4 - Convert a Program Template (Priority: P1)

As the application owner, I want a script that converts a training program from a structured Markdown file (like `program.md`) into a well-defined JSON file (`program.json`). This makes the platform's data source portable and easy to manage. The main application will then use this JSON file as its source of truth for the program structure.

**Why this priority**: This is a foundational architectural decision that makes the entire platform flexible and future-proof. It decouples the application from the complex parsing of Markdown and provides a clean, intermediate data format.

**Independent Test**: After running the conversion script with `program.md` as input, a `program.json` file is created. The JSON file's structure must be valid and accurately represent the content of the Markdown file, including phases, weeks, and exercise details.

**Acceptance Scenarios**:

1.  **Given** the `program.md` file, **When** I run `node scripts/convert.js --input program.md --output program.json`, **Then** the script generates a `program.json` file without errors.
2.  **Given** the `program.json` file has been generated, **When** I inspect its content, **Then** it contains a "phases" array, and the first phase object has the title "Phase 0 — Retour Progressif".

---

### Edge Cases

-   How does the system handle a missed or partially completed workout?
-   What happens if the user enters data in an incorrect format (e.g., text in a weight field)?
-   How are deload weeks, where intensity and volume are reduced, displayed differently?
-   How does the user log a failed set (e.g., aimed for 3 reps but only got 1)?

## Requirements *(mandatory)*

### Functional Requirements

-   **FR-001**: The system MUST parse and represent the entire `program.md` structure, including phases, weeks, daily sessions, and exercises with all their parameters.
-   **FR-002**: The system MUST provide a clear interface for the user to view their planned workout for any given day.
-   **FR-003**: The system MUST allow users to log their actual performance for each exercise set (e.g., weight, reps, RPE, time).
-   **FR-004**: The system MUST persist all logged workout data to a database.
-   **FR-005**: The system MUST allow users to add free-text notes to sessions and individual exercises.
-   **FR-006**: The system MUST automatically calculate and store estimated 1RMs (e1RM) from logged sets where applicable (e.g., from a 5RM test).
-   **FR-007**: The system MUST identify, store, and prominently display Personal Records (PRs) for main lifts.
-   **FR-008**: The system MUST provide visualizations (e.g., charts) for exercise performance progression over time.
-   **FR-009**: The system MUST allow a user to substitute an exercise in a planned workout from a list of valid alternatives.
-   **FR-010**: The system MUST clearly distinguish between different workout types (Max Effort, Dynamic Effort, Conditioning).
-   **FR-011**: The system MUST provide a command-line script to convert a training program from a structured Markdown file into a structured JSON file.
-   **FR-012**: The conversion script MUST be able to parse headings, lists, and text patterns to extract phases, weeks, sessions, exercises, sets, reps, weights, and other parameters.
-   **FR-013**: The conversion script MUST map the parsed data to a pre-defined JSON schema.
-   **FR-014**: The main backend application MUST use the generated `program.json` file as the source of truth for displaying the training program structure. The database will be used for user-generated data only (logs, PRs, etc.).

### Key Entities

-   **Program**: The overall training plan (e.g., "Programme Westside Rugby Masters 38 ans"). Contains a list of Phases.
-   **Phase**: A distinct block of training within the program (e.g., "Phase 1 — Base Force"). Contains a list of Weeks.
-   **WorkoutSession**: A specific, planned workout for a given day. Contains a list of Exercise Instances.
-   **ExerciseInstance**: A specific exercise to be performed in a session (e.g., "Goblet Squats"). Includes prescribed parameters like sets, reps, weight, rest, and notes.
-   **WorkoutLog**: The record of a completed (or partially completed) workout session, created by the user. Contains the actual performance data.
-   **Exercise**: A catalogue entry for an exercise (e.g., "Trap Bar Deadlift"). Contains its name, category (e.g., Lower Body), and type (e.g., Max Effort).

## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: A user can log a complete, multi-exercise workout session (like the one for "Lundi 25 Nov") in under 5 minutes of total interaction time.
-   **SC-002**: All key data points mentioned in `program.md` for a session (sets, reps, weight, RPE, rest times, notes, exercise type) can be successfully captured in the application's log.
-   **SC-003**: The user can view a line chart showing the progression of their estimated 1RM on the "Trap Bar Deadlift" over the first 3 months of the program.
-   **SC-004**: When a user logs a performance that exceeds a previous best for a given rep range on a main lift, the application automatically flags it as a new Personal Record (PR).
