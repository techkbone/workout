import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Button,
  Link
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LottieAnimation from './LottieAnimation';
import { glassmorphism } from '../theme/customTheme';

/**
 * ExerciseCard component displays exercise details with animations and video links
 * @param {Object} props
 * @param {Object} props.exercise - Exercise data
 * @param {string} props.exercise.name - Exercise name
 * @param {Object} props.exercise.exerciseDetails - Details from exercise library
 * @param {string} props.exercise.category - Exercise category
 * @param {string} props.exercise.equipment - Required equipment
 * @param {string} props.exercise.videoUrl - YouTube/Vimeo video URL
 * @param {string} props.exercise.animationUrl - Animation/GIF URL
 * @param {string} props.exercise.technicalNotes - Technical notes
 * @param {React.ReactNode} props.children - Additional content (sets, reps, etc.)
 */
function ExerciseCard({ exercise, children }) {
  const [expanded, setExpanded] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

  // Use exercise details if available
  const details = exercise.exerciseDetails || exercise;
  const {
    name,
    category,
    equipment,
    videoUrl,
    animationUrl,
    technicalNotes
  } = details;

  // Check if we have a valid video URL
  const hasVideo = videoUrl && videoUrl !== '▶ Voir vidéo' && videoUrl.startsWith('http');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        sx={{
          ...glassmorphism,
          mb: 2,
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
            borderColor: 'rgba(255, 255, 255, 0.35)',
            transform: 'translateY(-4px)'
          }
        }}
      >
        <CardContent>
          {/* Header with exercise name and category */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {name}
                </Typography>
              </motion.div>
              {category && (
                <motion.div
                  style={{ display: 'inline-block', marginRight: 8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={category}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(99, 102, 241, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(99, 102, 241, 0.5)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </motion.div>
              )}
              {equipment && (
                <motion.div
                  style={{ display: 'inline-block' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={equipment}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(236, 72, 153, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(236, 72, 153, 0.5)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </motion.div>
              )}
            </Box>

            {/* Info button to expand details */}
            {technicalNotes && (
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                  aria-label="show technical notes"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </motion.div>
            )}
          </Box>

        {/* Animation Display (default) */}
        {showAnimation && animationUrl && animationUrl !== ' Voir animation' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
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
              {/* For now, show placeholder. In production, load actual Lottie JSON */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 200,
                  mx: 'auto',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  🏋️ Animation: {name}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500
                }}
              >
                Animation démo
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Video Link Button */}
        {hasVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Button
                variant="contained"
                startIcon={<PlayCircleOutlineIcon />}
                component={Link}
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Voir la vidéo complète
              </Button>
            </Box>
          </motion.div>
        )}

        {/* Exercise prescription (sets, reps, weight) */}
        {children && (
          <Box sx={{ mb: 2 }}>
            {children}
          </Box>
        )}

        {/* Technical Notes (collapsible) */}
        {technicalNotes && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  background: 'rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  borderLeft: 3,
                  borderColor: 'rgba(59, 130, 246, 0.6)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 0.8)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <InfoOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 1, color: 'rgba(147, 197, 253, 1)' }}
                    />
                  </motion.div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: 600
                    }}
                  >
                    Notes techniques
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    lineHeight: 1.6
                  }}
                >
                  {technicalNotes}
                </Typography>
              </Box>
            </motion.div>
          </Collapse>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}

export default ExerciseCard;
