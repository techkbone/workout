import { Box, Paper, Skeleton } from '@mui/material'
import { motion } from 'framer-motion'
import { glassmorphism } from '../theme/customTheme'

/**
 * WorkoutSkeleton component displays an animated loading skeleton
 * that mimics the structure of a workout card
 */
function WorkoutSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      {/* Header Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={0}
          sx={{
            ...glassmorphism,
            p: 3,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{
                mr: 1,
                bgcolor: 'rgba(255, 255, 255, 0.2)'
              }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={40}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)'
              }}
            />
          </Box>
          <Skeleton
            variant="text"
            width="40%"
            height={28}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mb: 1
            }}
          />
          <Skeleton
            variant="rounded"
            width={100}
            height={24}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 2
            }}
          />
        </Paper>
      </motion.div>

      {/* Exercise Card Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Paper
          elevation={0}
          sx={{
            ...glassmorphism,
            p: 3,
            mb: 2,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
        >
          {/* Exercise name */}
          <Skeleton
            variant="text"
            width="50%"
            height={32}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mb: 2
            }}
          />

          {/* Category chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton
              variant="rounded"
              width={120}
              height={28}
              sx={{
                bgcolor: 'rgba(99, 102, 241, 0.3)',
                borderRadius: 2
              }}
            />
            <Skeleton
              variant="rounded"
              width={100}
              height={28}
              sx={{
                bgcolor: 'rgba(236, 72, 153, 0.3)',
                borderRadius: 2
              }}
            />
          </Box>

          {/* Animation placeholder */}
          <Box
            sx={{
              mb: 2,
              p: 2,
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 3,
              textAlign: 'center'
            }}
          >
            <Skeleton
              variant="rounded"
              width="100%"
              height={200}
              sx={{
                bgcolor: 'rgba(102, 126, 234, 0.2)',
                borderRadius: 2,
                maxWidth: 300,
                mx: 'auto'
              }}
            />
          </Box>

          {/* Sets/Reps info */}
          <Box sx={{ mt: 2 }}>
            <Skeleton
              variant="text"
              width="70%"
              height={24}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mb: 1
              }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={24}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mb: 1
              }}
            />
            <Skeleton
              variant="text"
              width="50%"
              height={24}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)'
              }}
            />
          </Box>
        </Paper>
      </motion.div>

      {/* Form Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Paper
          sx={{
            ...glassmorphism,
            mt: 3,
            p: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4
          }}
        >
          <Skeleton
            variant="text"
            width="50%"
            height={32}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mb: 2
            }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={120}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2
            }}
          />
        </Paper>
      </motion.div>

      {/* Button Skeleton */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Skeleton
          variant="rounded"
          width="100%"
          height={56}
          sx={{
            mt: 3,
            bgcolor: 'rgba(16, 185, 129, 0.3)',
            borderRadius: 3
          }}
        />
      </motion.div>
    </Box>
  )
}

export default WorkoutSkeleton
