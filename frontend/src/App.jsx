import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import TodayWorkout from './pages/TodayWorkout'
import Progress from './pages/Progress'
import Plan from './pages/Plan'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TodayIcon from '@mui/icons-material/Today'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import customTheme, { glassmorphism } from './theme/customTheme'

function App() {
  const [currentPage, setCurrentPage] = useState('today')

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  }

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <ErrorBoundary fallbackMessage="Unable to load the Workout Tracker. Please refresh the page.">
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite',
            '@keyframes gradientShift': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
          }}
        >
          {/* Glassmorphism AppBar */}
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              ...glassmorphism,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Toolbar>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              >
                <FitnessCenterIcon sx={{ mr: 2, color: 'white', fontSize: 32 }} />
              </motion.div>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                Workout Tracker
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<TodayIcon />}
                  onClick={() => setCurrentPage('today')}
                  sx={{
                    color: 'white',
                    borderRadius: 3,
                    px: 2,
                    bgcolor: currentPage === 'today' ? 'rgba(255,255,255,0.25)' : 'transparent',
                    backdropFilter: currentPage === 'today' ? 'blur(10px)' : 'none',
                    border: '1px solid',
                    borderColor: currentPage === 'today' ? 'rgba(255,255,255,0.4)' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  Today
                </Button>
                <Button
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => setCurrentPage('plan')}
                  sx={{
                    color: 'white',
                    borderRadius: 3,
                    px: 2,
                    bgcolor: currentPage === 'plan' ? 'rgba(255,255,255,0.25)' : 'transparent',
                    backdropFilter: currentPage === 'plan' ? 'blur(10px)' : 'none',
                    border: '1px solid',
                    borderColor: currentPage === 'plan' ? 'rgba(255,255,255,0.4)' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  Plan
                </Button>
                <Button
                  startIcon={<ShowChartIcon />}
                  onClick={() => setCurrentPage('progress')}
                  sx={{
                    color: 'white',
                    borderRadius: 3,
                    px: 2,
                    bgcolor: currentPage === 'progress' ? 'rgba(255,255,255,0.25)' : 'transparent',
                    backdropFilter: currentPage === 'progress' ? 'blur(10px)' : 'none',
                    border: '1px solid',
                    borderColor: currentPage === 'progress' ? 'rgba(255,255,255,0.4)' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  Progress
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Page Content with Animations */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <ErrorBoundary fallbackMessage="Unable to load this page.">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  {currentPage === 'today' && <TodayWorkout />}
                  {currentPage === 'plan' && <Plan />}
                  {currentPage === 'progress' && <Progress />}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </Box>
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
