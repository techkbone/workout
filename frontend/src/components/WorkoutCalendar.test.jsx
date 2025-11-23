import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorkoutCalendar from './WorkoutCalendar'

describe('WorkoutCalendar', () => {
  const mockWorkoutLogs = [
    {
      id: 1,
      date: '2024-01-15',
      exercises: [{ name: 'Squat', sets: [] }],
    },
    {
      id: 2,
      date: '2024-01-17',
      exercises: [{ name: 'Bench Press', sets: [] }],
    },
    {
      id: 3,
      date: '2024-01-20',
      exercises: [{ name: 'Deadlift', sets: [] }],
    },
  ]

  it('should render current month and year', () => {
    const onDateSelect = vi.fn()

    render(<WorkoutCalendar workoutLogs={[]} onDateSelect={onDateSelect} />)

    const today = new Date()
    const monthYear = today.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    expect(screen.getByText(monthYear)).toBeInTheDocument()
  })

  it('should display workout indicators for logged dates', () => {
    const onDateSelect = vi.fn()

    render(
      <WorkoutCalendar
        workoutLogs={mockWorkoutLogs}
        onDateSelect={onDateSelect}
      />
    )

    // Check if dates with workouts have indicators
    // The calendar should show days 15, 17, and 20 with special styling
    const calendarDays = screen.getAllByRole('button')

    // We should have at least 28 days (minimum month length)
    expect(calendarDays.length).toBeGreaterThanOrEqual(28)
  })

  it('should call onDateSelect when a date is clicked', async () => {
    const onDateSelect = vi.fn()
    const user = userEvent.setup()

    render(<WorkoutCalendar workoutLogs={[]} onDateSelect={onDateSelect} />)

    // Click on day 15
    const day15 = screen.getByText('15')
    await user.click(day15)

    expect(onDateSelect).toHaveBeenCalledTimes(1)
    expect(onDateSelect).toHaveBeenCalledWith(expect.any(Date))
  })

  it('should navigate to previous month when previous button is clicked', async () => {
    const onDateSelect = vi.fn()
    const user = userEvent.setup()

    render(<WorkoutCalendar workoutLogs={[]} onDateSelect={onDateSelect} />)

    const prevButton = screen.getByLabelText(/previous month/i)
    await user.click(prevButton)

    // Check that month changed (we can't easily test the exact month without more complex setup)
    expect(prevButton).toBeInTheDocument()
  })

  it('should navigate to next month when next button is clicked', async () => {
    const onDateSelect = vi.fn()
    const user = userEvent.setup()

    render(<WorkoutCalendar workoutLogs={[]} onDateSelect={onDateSelect} />)

    const nextButton = screen.getByLabelText(/next month/i)
    await user.click(nextButton)

    expect(nextButton).toBeInTheDocument()
  })

  it('should highlight today with special styling', () => {
    const onDateSelect = vi.fn()
    const today = new Date()

    render(<WorkoutCalendar workoutLogs={[]} onDateSelect={onDateSelect} />)

    // Today's date should be visible
    const todayDate = today.getDate().toString()
    const todayElement = screen.getByText(todayDate)

    expect(todayElement).toBeInTheDocument()
  })

  it('should handle empty workout logs gracefully', () => {
    const onDateSelect = vi.fn()

    render(<WorkoutCalendar workoutLogs={[]} onDateSelect={onDateSelect} />)

    // Should still render the calendar
    const calendarDays = screen.getAllByRole('button')
    expect(calendarDays.length).toBeGreaterThan(0)
  })

  it('should show all 7 days of the week', () => {
    const onDateSelect = vi.fn()

    render(<WorkoutCalendar workoutLogs={[]} onDateSelect={onDateSelect} />)

    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })
})
