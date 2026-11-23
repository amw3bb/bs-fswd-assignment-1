import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
} from '../api/events.js'
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export function PostStats({ postId }) {
  const totalViews = useQuery({
    queryKey: ['totalViews', postId],
    queryFn: () => getTotalViews(postId),
  })
  const dailyViews = useQuery({
    queryKey: ['dailyViews', postId],
    queryFn: () => getDailyViews(postId),
  })
  const dailyDurations = useQuery({
    queryKey: ['dailyDurations', postId],
    queryFn: () => getDailyDurations(postId),
  })
  if (
    totalViews.isLoading ||
    dailyViews.isLoading ||
    dailyDurations.isLoading
  ) {
    return <Typography color='text.secondary'>Loading stats...</Typography>
  }
  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Typography variant='h6' component='p'>
        {totalViews.data?.views} total views
      </Typography>
      <Paper variant='outlined' sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
        <Box sx={{ width: '100%' }}>
          <VictoryChart domainPadding={16}>
            <VictoryBar
              labelComponent={<VictoryTooltip />}
              data={dailyViews.data?.map((d) => ({
                x: new Date(d._id),
                y: d.views,
                label: `${new Date(d._id).toLocaleDateString()}:${
                  d.views
                } views`,
              }))}
            />
          </VictoryChart>
        </Box>
      </Paper>
      <Paper variant='outlined' sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
        <Typography variant='h6' component='h2' sx={{ px: 1, pt: 1 }}>
          Daily Average Viewing Duration
        </Typography>
        <Box sx={{ width: '100%' }}>
          <VictoryChart
            domainPadding={16}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension='x'
                labels={({ datum }) =>
                  `${datum.x.toLocaleDateString()}: ${datum.y.toFixed(
                    2,
                  )} minutes`
                }
                labelComponent={<VictoryTooltip />}
              />
            }
          >
            <VictoryLine
              data={dailyDurations.data?.map((d) => ({
                x: new Date(d._id),
                y: d.averageDuration / (60 * 1000),
              }))}
            />
          </VictoryChart>
        </Box>
      </Paper>
    </Stack>
  )
}
PostStats.propTypes = {
  postId: PropTypes.string.isRequired,
}
