import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import TodayWorkout from './TodayWorkout'
import * as apiClient from '../services/apiClient'

vi.mock('../services/apiClient')

describe('TodayWorkout page', () => {
  const mockWorkout = [
    {
      name: 'Bench Press',
      sets: [{ sets: 5, reps: 5, percentage: 80 }],
    },
  ]

  beforeEach(() => {
    apiClient.getTodaysWorkout.mockResolvedValue(mockWorkout)
    apiClient.logWorkout.mockResolvedValue({ id: 1 })
  })

  it('should render the workout and log a session', async () => {
    render(<TodayWorkout />)

    // Wait for the workout to be loaded and displayed
    expect(await screen.findByText("Today's Workout")).toBeInTheDocument()
    expect(screen.getAllByText('Bench Press').length).toBeGreaterThan(0)

    // Fill the form for the exercise
    const weightInput = screen.getByLabelText('Weight')
    const repsInput = screen.getByLabelText('Reps')
    fireEvent.change(weightInput, { target: { value: '80' } })
    fireEvent.change(repsInput, { target: { value: '5' } })

    // Submit the exercise log (this updates state)
    const logExerciseButton = screen.getByText('Log Exercise')
    fireEvent.click(logExerciseButton)

    // Now submit the entire workout
    const submitWorkoutButton = screen.getByText('Submit Workout')
    expect(submitWorkoutButton).toBeEnabled()
    fireEvent.click(submitWorkoutButton)

    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(apiClient.logWorkout).toHaveBeenCalledWith('1', {
        date: expect.any(String),
        exercises: [
          {
            name: 'Bench Press',
            sets: [{ weight: 80, reps: 5 }],
          },
        ],
      })
    })

    // Verify success message is displayed
    expect(
      await screen.findByText('Workout logged successfully!')
    ).toBeInTheDocument()
  })

  it('should disable submit button when no exercises are logged', async () => {
    render(<TodayWorkout />)

    // Wait for the workout to be loaded
    await screen.findByText("Today's Workout")

    // Submit button should be disabled initially
    const submitWorkoutButton = screen.getByText('Submit Workout')
    expect(submitWorkoutButton).toBeDisabled()
  })

  it('should handle errors when logging workout fails', async () => {
    // Mock logWorkout to reject
    apiClient.logWorkout.mockRejectedValueOnce(new Error('Network error'))

    render(<TodayWorkout />)

    // Wait for workout and fill form
    await screen.findByText("Today's Workout")
    const weightInput = screen.getByLabelText('Weight')
    const repsInput = screen.getByLabelText('Reps')
    fireEvent.change(weightInput, { target: { value: '80' } })
    fireEvent.change(repsInput, { target: { value: '5' } })

    // Log exercise and submit workout
    fireEvent.click(screen.getByText('Log Exercise'))
    fireEvent.click(screen.getByText('Submit Workout'))

    // Verify error message is displayed (matches the Alert component format)
    expect(await screen.findByText(/Network error/)).toBeInTheDocument()
  })
})
