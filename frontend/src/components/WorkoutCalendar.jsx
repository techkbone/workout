import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  Chip,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

function WorkoutCalendar({
  workoutLogs = [],
  plannedWorkouts = [],
  onDateSelect,
}) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const formatDateString = (date) => {
    // Use local time for calendar display
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const hasWorkoutOnDate = (date) => {
    const dateString = formatDateString(date)

    // Check if there's a planned workout for this date
    const hasPlanned = plannedWorkouts.some((workout) => {
      return workout.date === dateString
    })

    // Check if there's a logged workout for this date
    const hasLogged = workoutLogs.some((log) => {
      const logDate = new Date(log.date)
      return (
        logDate.getFullYear() === date.getFullYear() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getDate() === date.getDate()
      )
    })

    return { hasPlanned, hasLogged }
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const today = new Date()

  const renderCalendarDays = () => {
    const days = []
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    // Header
    days.push(
      <Box
        key="header"
        sx={{
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <IconButton onClick={() => navigateMonth(-1)}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>
        <IconButton onClick={() => navigateMonth(1)}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    )

    // Weekday headers
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    weekdays.forEach((day) => {
      days.push(
        <Box
          key={`weekday-${day}`}
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'text.secondary',
            py: 1,
          }}
        >
          <Typography variant="caption">{day}</Typography>
        </Box>
      )
    })

    // Empty cells before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<Box key={`empty-${i}`} />)
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      )
      const { hasPlanned, hasLogged } = hasWorkoutOnDate(date)
      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()

      days.push(
        <Box
          key={`day-${day}`}
          onClick={() => onDateSelect && onDateSelect(date)}
          sx={{
            textAlign: 'center',
            p: 1,
            cursor: onDateSelect ? 'pointer' : 'default',
            borderRadius: 1,
            position: 'relative',
            bgcolor: isToday ? 'primary.light' : 'transparent',
            '&:hover': {
              bgcolor: onDateSelect ? 'action.hover' : 'transparent',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: isToday ? 'bold' : 'normal',
              color: isToday ? 'primary.contrastText' : 'text.primary',
            }}
          >
            {day}
          </Typography>
          {hasPlanned && !hasLogged && (
            <FitnessCenterIcon
              sx={{
                fontSize: 12,
                position: 'absolute',
                bottom: 2,
                right: 2,
                color: isToday ? 'primary.contrastText' : 'info.main',
                opacity: 0.6,
              }}
            />
          )}
          {hasLogged && (
            <FitnessCenterIcon
              sx={{
                fontSize: 12,
                position: 'absolute',
                bottom: 2,
                right: 2,
                color: isToday ? 'primary.contrastText' : 'success.main',
              }}
            />
          )}
        </Box>
      )
    }

    return days
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Workout Calendar
          </Typography>
          <Chip
            icon={<FitnessCenterIcon />}
            label={`${workoutLogs.length} workouts`}
            size="small"
            color="primary"
          />
        </Box>

        <Grid
          container
          spacing={0}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
          }}
        >
          {renderCalendarDays()}
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FitnessCenterIcon fontSize="small" color="success" />
            <Typography variant="caption">Completed Workout</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                bgcolor: 'primary.light',
              }}
            />
            <Typography variant="caption">Today</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WorkoutCalendar
