import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExerciseSubstitutionModal from './ExerciseSubstitutionModal'
import * as apiClient from '../services/apiClient'

// Mock the API client
vi.mock('../services/apiClient')

describe('ExerciseSubstitutionModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSubstitute = vi.fn()
  const exerciseName = 'Trap Bar Deadlift'

  const mockAlternatives = {
    exerciseName: 'Trap Bar Deadlift',
    category: 'Lower Body - Posterior Chain',
    type: 'Max Effort',
    alternatives: ['Conventional Deadlift', 'Sumo Deadlift', 'Deficit Deadlift'],
  }

  const mockValidation = {
    isValid: true,
    message: 'Valid substitution - same category',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when open is false', () => {
    render(
      <ExerciseSubstitutionModal
        open={false}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    expect(
      screen.queryByText(`Substitute Exercise: ${exerciseName}`)
    ).not.toBeInTheDocument()
  })

  it('should render and load alternatives when opened', async () => {
    apiClient.getAlternativeExercises.mockResolvedValue(mockAlternatives)

    render(
      <ExerciseSubstitutionModal
        open={true}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    expect(
      screen.getByText(`Substitute Exercise: ${exerciseName}`)
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Conventional Deadlift')).toBeInTheDocument()
      expect(screen.getByText('Sumo Deadlift')).toBeInTheDocument()
      expect(screen.getByText('Deficit Deadlift')).toBeInTheDocument()
    })

    expect(apiClient.getAlternativeExercises).toHaveBeenCalledWith(
      '1',
      exerciseName
    )
  })

  it('should display error when alternatives loading fails', async () => {
    apiClient.getAlternativeExercises.mockRejectedValue(
      new Error('Failed to fetch alternatives')
    )

    render(
      <ExerciseSubstitutionModal
        open={true}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch alternatives/i)
      ).toBeInTheDocument()
    })
  })

  it('should validate substitution when alternative is selected', async () => {
    apiClient.getAlternativeExercises.mockResolvedValue(mockAlternatives)
    apiClient.validateSubstitution.mockResolvedValue(mockValidation)

    render(
      <ExerciseSubstitutionModal
        open={true}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByText('Conventional Deadlift')).toBeInTheDocument()
    })

    // Click on an alternative
    await user.click(screen.getByText('Conventional Deadlift'))

    await waitFor(() => {
      expect(apiClient.validateSubstitution).toHaveBeenCalledWith(
        '1',
        exerciseName,
        'Conventional Deadlift'
      )
      expect(
        screen.getByText('Valid substitution - same category')
      ).toBeInTheDocument()
    })
  })

  it('should allow entering custom exercise name', async () => {
    apiClient.getAlternativeExercises.mockResolvedValue(mockAlternatives)
    apiClient.validateSubstitution.mockResolvedValue({
      isValid: true,
      message: 'Custom exercise - no validation available',
      warning: 'Make sure this exercise targets similar movement patterns',
    })

    render(
      <ExerciseSubstitutionModal
        open={true}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByText('Conventional Deadlift')).toBeInTheDocument()
    })

    // Enter custom exercise
    const customInput = screen.getByPlaceholderText(/e\.g\., Bench Press/i)
    await user.type(customInput, 'Romanian Deadlift')

    // Click use custom exercise button
    const useCustomButton = screen.getByRole('button', {
      name: /use custom exercise/i,
    })
    await user.click(useCustomButton)

    await waitFor(() => {
      expect(apiClient.validateSubstitution).toHaveBeenCalledWith(
        '1',
        exerciseName,
        'Romanian Deadlift'
      )
      expect(
        screen.getByText(/Make sure this exercise targets similar movement patterns/i)
      ).toBeInTheDocument()
    })
  })

  it('should disable confirm button when no exercise is selected', async () => {
    apiClient.getAlternativeExercises.mockResolvedValue(mockAlternatives)

    render(
      <ExerciseSubstitutionModal
        open={true}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Conventional Deadlift')).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole('button', {
      name: /confirm substitution/i,
    })
    expect(confirmButton).toBeDisabled()
  })

  it('should call onSubstitute and close when confirm is clicked', async () => {
    apiClient.getAlternativeExercises.mockResolvedValue(mockAlternatives)
    apiClient.validateSubstitution.mockResolvedValue(mockValidation)

    render(
      <ExerciseSubstitutionModal
        open={true}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByText('Sumo Deadlift')).toBeInTheDocument()
    })

    // Select an alternative
    await user.click(screen.getByText('Sumo Deadlift'))

    await waitFor(() => {
      expect(screen.getByText('Valid substitution - same category')).toBeInTheDocument()
    })

    // Confirm substitution
    const confirmButton = screen.getByRole('button', {
      name: /confirm substitution/i,
    })
    await user.click(confirmButton)

    expect(mockOnSubstitute).toHaveBeenCalledWith(
      exerciseName,
      'Sumo Deadlift',
      mockValidation
    )
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when cancel is clicked', async () => {
    apiClient.getAlternativeExercises.mockResolvedValue(mockAlternatives)

    render(
      <ExerciseSubstitutionModal
        open={true}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByText('Conventional Deadlift')).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should display warning validation result with warning severity', async () => {
    apiClient.getAlternativeExercises.mockResolvedValue(mockAlternatives)
    apiClient.validateSubstitution.mockResolvedValue({
      isValid: true,
      message: 'Warning: Different movement category',
      warning: 'Original: Lower Body - Posterior Chain, Substitute: Upper Body - Horizontal Press',
    })

    render(
      <ExerciseSubstitutionModal
        open={true}
        exerciseName={exerciseName}
        onClose={mockOnClose}
        onSubstitute={mockOnSubstitute}
      />
    )

    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByText('Conventional Deadlift')).toBeInTheDocument()
    })

    // Click on an alternative
    await user.click(screen.getByText('Conventional Deadlift'))

    await waitFor(() => {
      expect(
        screen.getByText(/Warning: Different movement category/i)
      ).toBeInTheDocument()
    })
  })
})
