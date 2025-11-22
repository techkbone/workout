import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'

function ExerciseHistoryChart({ exerciseName, progressData }) {
  if (
    !progressData ||
    !progressData.chartData ||
    progressData.chartData.length === 0
  ) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Progress Chart - {exerciseName}
          </Typography>
          <Typography color="text.secondary">
            No workout data available for this exercise.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  // Format date for chart display
  const chartData = progressData.chartData.map((point) => ({
    ...point,
    dateFormatted: new Date(point.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  const getTrendIcon = () => {
    switch (progressData.trend) {
      case 'improving':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />
      case 'declining':
        return <TrendingDownIcon sx={{ color: 'error.main' }} />
      default:
        return <TrendingFlatIcon sx={{ color: 'info.main' }} />
    }
  }

  const getTrendColor = () => {
    switch (progressData.trend) {
      case 'improving':
        return 'success'
      case 'declining':
        return 'error'
      default:
        return 'info'
    }
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Progress Chart - {exerciseName}</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {getTrendIcon()}
            <Chip
              label={`${progressData.percentChange > 0 ? '+' : ''}${progressData.percentChange}%`}
              color={getTrendColor()}
              size="small"
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Period: {progressData.period} • Data points:{' '}
            {progressData.dataPoints}
          </Typography>
          {progressData.averageEstimated1RM && (
            <Typography variant="body2" color="text.secondary">
              Avg. e1RM: {progressData.averageEstimated1RM.first} kg →{' '}
              {progressData.averageEstimated1RM.recent} kg
            </Typography>
          )}
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dateFormatted"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              label={{
                value: 'Estimated 1RM (kg)',
                angle: -90,
                position: 'insideLeft',
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`${value} kg`, 'Est. 1RM']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="estimated1RM"
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Estimated 1RM"
            />
          </LineChart>
        </ResponsiveContainer>

        {progressData.trend && (
          <Box
            sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}
          >
            <Typography variant="caption" color="text.secondary">
              <strong>Trend:</strong> Your performance is{' '}
              <strong>{progressData.trend}</strong> over the past{' '}
              {progressData.period}.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ExerciseHistoryChart
