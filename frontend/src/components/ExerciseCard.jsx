import { useState } from 'react';
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
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardContent>
        {/* Header with exercise name and category */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {name}
            </Typography>
            {category && (
              <Chip
                label={category}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mr: 1 }}
              />
            )}
            {equipment && (
              <Chip
                label={equipment}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          {/* Info button to expand details */}
          {technicalNotes && (
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
              aria-label="show technical notes"
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </Box>

        {/* Animation Display (default) */}
        {showAnimation && animationUrl && animationUrl !== ' Voir animation' && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
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
                bgcolor: 'grey.200',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                🏋️ Animation: {name}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Animation démo
            </Typography>
          </Box>
        )}

        {/* Video Link Button */}
        {hasVideo && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<PlayCircleOutlineIcon />}
              component={Link}
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none' }}
            >
              Voir la vidéo complète
            </Button>
          </Box>
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
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'info.light',
                borderRadius: 1,
                borderLeft: 3,
                borderColor: 'info.main'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'info.dark' }} />
                <Typography variant="subtitle2" color="info.dark">
                  Notes techniques
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {technicalNotes}
              </Typography>
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
}

export default ExerciseCard;
