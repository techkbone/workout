import { useState } from 'react'
import './App.css'
import TodayWorkout from './pages/TodayWorkout'
import Progress from './pages/Progress'
import Plan from './pages/Plan'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TodayIcon from '@mui/icons-material/Today'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

function App() {
  const [currentPage, setCurrentPage] = useState('today')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <FitnessCenterIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Workout Tracker
          </Typography>
          <Button
            color="inherit"
            startIcon={<TodayIcon />}
            onClick={() => setCurrentPage('today')}
            sx={{
              bgcolor:
                currentPage === 'today'
                  ? 'rgba(255,255,255,0.1)'
                  : 'transparent',
            }}
          >
            Today
          </Button>
          <Button
            color="inherit"
            startIcon={<CalendarMonthIcon />}
            onClick={() => setCurrentPage('plan')}
            sx={{
              bgcolor:
                currentPage === 'plan'
                  ? 'rgba(255,255,255,0.1)'
                  : 'transparent',
            }}
          >
            Plan
          </Button>
          <Button
            color="inherit"
            startIcon={<ShowChartIcon />}
            onClick={() => setCurrentPage('progress')}
            sx={{
              bgcolor:
                currentPage === 'progress'
                  ? 'rgba(255,255,255,0.1)'
                  : 'transparent',
            }}
          >
            Progress
          </Button>
        </Toolbar>
      </AppBar>

      <Box>
        {currentPage === 'today' && <TodayWorkout />}
        {currentPage === 'plan' && <Plan />}
        {currentPage === 'progress' && <Progress />}
      </Box>
    </Box>
  )
}

export default App
