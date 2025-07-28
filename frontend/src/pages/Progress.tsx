import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';

import {
  TrendingUp,
  TrendingDown,
  Remove,
  CalendarToday,
  Assessment,
  Timeline,
  BarChart,
} from '@mui/icons-material';

interface ProgressData {
  date: string;
  module: string;
  score: number;
  duration: number;
  waves: {
    alpha: number;
    beta: number;
    theta: number;
    delta: number;
    gamma: number;
  };
}

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Mock progress data
  const progressData: ProgressData[] = [
    {
      date: '2024-01-15',
      module: 'Alpha Wave Training',
      score: 85,
      duration: 15,
      waves: { alpha: 12.5, beta: 18.2, theta: 6.8, delta: 2.1, gamma: 8.9 },
    },
    {
      date: '2024-01-14',
      module: 'Focus Enhancement',
      score: 92,
      duration: 20,
      waves: { alpha: 11.8, beta: 22.1, theta: 5.2, delta: 1.8, gamma: 12.3 },
    },
    {
      date: '2024-01-13',
      module: 'Alpha Wave Training',
      score: 78,
      duration: 15,
      waves: { alpha: 10.2, beta: 16.5, theta: 7.4, delta: 2.5, gamma: 7.8 },
    },
    {
      date: '2024-01-12',
      module: 'Focus Enhancement',
      score: 88,
      duration: 20,
      waves: { alpha: 12.1, beta: 20.8, theta: 6.1, delta: 2.0, gamma: 10.2 },
    },
    {
      date: '2024-01-11',
      module: 'Alpha Wave Training',
      score: 82,
      duration: 15,
      waves: { alpha: 11.5, beta: 17.9, theta: 6.9, delta: 2.2, gamma: 8.5 },
    },
  ];

  const overallStats = {
    totalSessions: 24,
    averageScore: 78,
    totalDuration: 360, // minutes
    improvement: 12, // percentage
    currentStreak: 5,
    bestScore: 95,
  };

  const waveTrends = {
    alpha: { current: 12.5, average: 11.8, trend: 'up' },
    beta: { current: 18.2, average: 17.5, trend: 'up' },
    theta: { current: 6.8, average: 7.2, trend: 'down' },
    delta: { current: 2.1, average: 2.3, trend: 'down' },
    gamma: { current: 8.9, average: 8.2, trend: 'up' },
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'down':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return <Remove sx={{ color: 'text.secondary' }} />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
    <div hidden={value !== index} style={{ paddingTop: 20 }}>
      {value === index && children}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Progress Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your EEG training progress and performance metrics over time.
      </Typography>

      {/* Overall Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Total Sessions</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {overallStats.totalSessions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6">Avg Score</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {overallStats.averageScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6">Current Streak</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {overallStats.currentStreak} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6">Improvement</Typography>
              </Box>
              <Typography variant="h4" component="div">
                +{overallStats.improvement}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Recent Sessions" />
            <Tab label="Wave Analysis" />
            <Tab label="Performance Trends" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Alpha</TableCell>
                  <TableCell>Beta</TableCell>
                  <TableCell>Theta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {progressData.map((session, index) => (
                  <TableRow key={index}>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.module}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${session.score}%`}
                        color={getScoreColor(session.score) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDuration(session.duration)}</TableCell>
                    <TableCell>{session.waves.alpha.toFixed(1)} Hz</TableCell>
                    <TableCell>{session.waves.beta.toFixed(1)} Hz</TableCell>
                    <TableCell>{session.waves.theta.toFixed(1)} Hz</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            {Object.entries(waveTrends).map(([waveType, data]) => (
              <Grid item xs={12} sm={6} md={4} key={waveType}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                        {waveType} Waves
                      </Typography>
                      {getTrendIcon(data.trend)}
                    </Box>
                    
                    <Typography variant="h4" component="div" gutterBottom>
                      {data.current.toFixed(1)} Hz
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Average: {data.average.toFixed(1)} Hz
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={(data.current / 25) * 100} // Assuming max is 25 Hz for visualization
                        sx={{ flexGrow: 1, mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {((data.current / data.average - 1) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Score Progression
                  </Typography>
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary">
                      Score trend chart would be displayed here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Session Duration
                  </Typography>
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration trend chart would be displayed here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Insights
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🎯 Best Performance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your best score was {overallStats.bestScore}% in Focus Enhancement module
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  📈 Improvement Trend
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You've improved by {overallStats.improvement}% over the last 30 days
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ⏱️ Total Training Time
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You've spent {formatDuration(overallStats.totalDuration)} training
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🔥 Current Streak
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You're on a {overallStats.currentStreak}-day training streak
                </Typography>
                              </Box>
              </Grid>
            </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Progress;