import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Progress from './Progress'
import * as apiClient from '../services/apiClient'

// Mock the API client
vi.mock('../services/apiClient')

// Mock child components to simplify testing
vi.mock('../components/PRDisplay', () => ({
  default: ({ prs }) => <div data-testid="pr-display">{prs.length} PRs</div>,
}))

vi.mock('../components/ExerciseHistoryChart', () => ({
  default: ({ data }) => (
    <div data-testid="exercise-chart">
      {data?.history?.length || 0} data points
    </div>
  ),
}))

describe('Progress Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the progress page with title', () => {
    apiClient.getPersonalRecords.mockResolvedValue([])

    render(<Progress />)

    expect(screen.getByText('Progress & Analytics')).toBeInTheDocument()
  })

  it('should load and display personal records on mount', async () => {
    const mockPRs = [
      {
        id: 1,
        exercise_name: 'Trap Bar Deadlift',
        weight: 200,
        rep_range: 5,
        estimated_1rm: 220,
        achieved_date: '2024-01-15',
      },
      {
        id: 2,
        exercise_name: 'Floor Press Haltères',
        weight: 100,
        rep_range: 3,
        estimated_1rm: 105,
        achieved_date: '2024-01-20',
      },
    ]

    apiClient.getPersonalRecords.mockResolvedValue(mockPRs)

    render(<Progress />)

    await waitFor(() => {
      expect(screen.getByText('2 PRs')).toBeInTheDocument()
    })

    expect(apiClient.getPersonalRecords).toHaveBeenCalledWith('1')
  })

  it('should show error message when PR loading fails', async () => {
    const errorMessage = 'Failed to fetch PRs'
    apiClient.getPersonalRecords.mockRejectedValue(new Error(errorMessage))

    render(<Progress />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch PRs/i)).toBeInTheDocument()
    })
  })

  it('should load exercise progress when form is submitted', async () => {
    apiClient.getPersonalRecords.mockResolvedValue([])
    apiClient.getProgressAnalytics.mockResolvedValue({
      exerciseName: 'Trap Bar Deadlift',
      history: [
        { date: '2024-01-01', weight: 180, reps: 5 },
        { date: '2024-01-08', weight: 190, reps: 5 },
      ],
      bestLifts: { weight: 190, reps: 5 },
    })

    render(<Progress />)

    const user = userEvent.setup()

    // Select an exercise from the dropdown
    const exerciseSelect = screen.getByLabelText(/select exercise/i)
    await user.click(exerciseSelect)
    await user.click(screen.getByText('Trap Bar Deadlift'))

    // Click the load progress button
    const loadButton = screen.getByRole('button', { name: /load progress/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(screen.getByText('2 data points')).toBeInTheDocument()
    })

    expect(apiClient.getProgressAnalytics).toHaveBeenCalledWith(
      '1',
      'Trap Bar Deadlift',
      90
    )
  })

  it('should allow loading progress with custom exercise name', async () => {
    apiClient.getPersonalRecords.mockResolvedValue([])
    apiClient.getProgressAnalytics.mockResolvedValue({
      exerciseName: 'Custom Exercise',
      history: [],
      bestLifts: null,
    })

    render(<Progress />)

    const user = userEvent.setup()

    // Enter a custom exercise name
    const customInput = screen.getByLabelText(/or enter custom exercise/i)
    await user.type(customInput, 'Custom Exercise')

    // Click the load progress button
    const loadButton = screen.getByRole('button', { name: /load progress/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(apiClient.getProgressAnalytics).toHaveBeenCalledWith(
        '1',
        'Custom Exercise',
        90
      )
    })
  })

  it('should show error when trying to load progress without selecting exercise', async () => {
    apiClient.getPersonalRecords.mockResolvedValue([])

    render(<Progress />)

    const user = userEvent.setup()

    // Click load button without selecting an exercise
    const loadButton = screen.getByRole('button', { name: /load progress/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(
        screen.getByText(/please select or enter an exercise name/i)
      ).toBeInTheDocument()
    })
  })

  it('should allow changing the time period', async () => {
    apiClient.getPersonalRecords.mockResolvedValue([])
    apiClient.getProgressAnalytics.mockResolvedValue({
      exerciseName: 'Box Squats',
      history: [],
      bestLifts: null,
    })

    render(<Progress />)

    const user = userEvent.setup()

    // Select an exercise
    const exerciseSelect = screen.getByLabelText(/select exercise/i)
    await user.click(exerciseSelect)
    await user.click(screen.getByText('Box Squats'))

    // Change the period
    const periodSelect = screen.getByLabelText(/time period/i)
    await user.click(periodSelect)
    await user.click(screen.getByText('6 months'))

    // Load progress
    const loadButton = screen.getByRole('button', { name: /load progress/i })
    await user.click(loadButton)

    await waitFor(() => {
      expect(apiClient.getProgressAnalytics).toHaveBeenCalledWith(
        '1',
        'Box Squats',
        180
      )
    })
  })
})
