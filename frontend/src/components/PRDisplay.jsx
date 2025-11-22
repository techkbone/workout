import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
} from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

function PRDisplay({ prs, exerciseName }) {
  if (!prs || prs.length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personal Records {exerciseName && `- ${exerciseName}`}
          </Typography>
          <Typography color="text.secondary">
            No personal records yet. Keep training!
          </Typography>
        </CardContent>
      </Card>
    )
  }

  // Group PRs by exercise if showing all PRs
  const groupedPRs = prs.reduce((acc, pr) => {
    if (!acc[pr.exercise_name]) {
      acc[pr.exercise_name] = []
    }
    acc[pr.exercise_name].push(pr)
    return acc
  }, {})

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiEventsIcon sx={{ mr: 1, color: 'gold' }} />
          <Typography variant="h6">
            Personal Records {exerciseName && `- ${exerciseName}`}
          </Typography>
        </Box>

        {Object.entries(groupedPRs).map(([exercise, records]) => (
          <Box key={exercise} sx={{ mb: 3 }}>
            {!exerciseName && (
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                {exercise}
              </Typography>
            )}

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rep Range</TableCell>
                    <TableCell align="right">Weight</TableCell>
                    <TableCell align="right">Est. 1RM</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((pr) => (
                    <TableRow key={pr.id}>
                      <TableCell>
                        <Chip
                          label={`${pr.rep_range}RM`}
                          size="small"
                          color={pr.rep_range === 1 ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {pr.weight} kg
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {pr.estimated_1rm} kg
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(pr.achieved_date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

export default PRDisplay
