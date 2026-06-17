import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BrainIcon from '@mui/icons-material/Psychology';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DownloadIcon from '@mui/icons-material/Download';

interface SessionData {
  id: string;
  date: string;
  module: string;
  duration: number;
  score: number;
  improvement: number;
}

const Progress: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();

  // Mock data - in a real app, this would come from your backend
  const overallStats = {
    totalSessions: 47,
    totalHours: 28.5,
    averageScore: 84,
    improvement: 23,
    currentStreak: 12,
    bestStreak: 18,
  };

  const moduleProgress = [
    {
      name: 'Attention Training',
      current: 87,
      baseline: 65,
      sessions: 15,
      color: theme.palette.primary.main,
    },
    {
      name: 'Memory Enhancement',
      current: 78,
      baseline: 62,
      sessions: 12,
      color: theme.palette.secondary.main,
    },
    {
      name: 'Cognitive Flexibility',
      current: 91,
      baseline: 71,
      sessions: 8,
      color: theme.palette.success.main,
    },
    {
      name: 'Processing Speed',
      current: 82,
      baseline: 58,
      sessions: 12,
      color: theme.palette.warning.main,
    },
  ];

  const recentSessions: SessionData[] = [
    {
      id: '1',
      date: '2024-01-15',
      module: 'Attention Training',
      duration: 18,
      score: 92,
      improvement: 5,
    },
    {
      id: '2',
      date: '2024-01-14',
      module: 'Memory Enhancement',
      duration: 22,
      score: 88,
      improvement: 3,
    },
    {
      id: '3',
      date: '2024-01-13',
      module: 'Cognitive Flexibility',
      duration: 25,
      score: 95,
      improvement: 8,
    },
    {
      id: '4',
      date: '2024-01-12',
      module: 'Processing Speed',
      duration: 15,
      score: 79,
      improvement: -2,
    },
    {
      id: '5',
      date: '2024-01-11',
      module: 'Attention Training',
      duration: 20,
      score: 87,
      improvement: 4,
    },
  ];

  const achievements = [
    {
      title: 'First Week Complete',
      description: 'Completed 7 consecutive training sessions',
      icon: <CalendarTodayIcon />,
      earned: true,
      date: '2024-01-08',
    },
    {
      title: 'Perfect Score',
      description: 'Achieved 100% score in any training module',
      icon: <EmojiEventsIcon />,
      earned: true,
      date: '2024-01-10',
    },
    {
      title: 'Speed Demon',
      description: 'Complete 10 processing speed sessions',
      icon: <TimerIcon />,
      earned: true,
      date: '2024-01-12',
    },
    {
      title: 'Marathon Trainer',
      description: 'Complete 50 total training sessions',
      icon: <BrainIcon />,
      earned: false,
      date: null,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return theme.palette.success.main;
    if (improvement < 0) return theme.palette.error.main;
    return theme.palette.grey[500];
  };

  const getImprovementIcon = (improvement: number) => {
    return improvement >= 0 ? '↗' : '↘';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Progress Analytics
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Track your cognitive training journey and improvements
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ height: 'fit-content' }}
          >
            Export Report
          </Button>
        </Box>

        {/* Overall Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <BrainIcon />
                </Avatar>
                <Typography variant="h5" component="div" gutterBottom>
                  {overallStats.totalSessions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <TimerIcon />
                </Avatar>
                <Typography variant="h5" component="div" gutterBottom>
                  {overallStats.totalHours}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Training Time
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.success.main,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h5" component="div" gutterBottom>
                  {overallStats.averageScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.warning.main,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <BarChartIcon />
                </Avatar>
                <Typography variant="h5" component="div" gutterBottom>
                  +{overallStats.improvement}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Improvement
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.info.main,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <CalendarTodayIcon />
                </Avatar>
                <Typography variant="h5" component="div" gutterBottom>
                  {overallStats.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.error.main,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <EmojiEventsIcon />
                </Avatar>
                <Typography variant="h5" component="div" gutterBottom>
                  {overallStats.bestStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Best Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs for different views */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontWeight: 600,
              },
            }}
          >
            <Tab label="Module Progress" />
            <Tab label="Recent Sessions" />
            <Tab label="Achievements" />
            <Tab label="Trends" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {moduleProgress.map((module, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: module.color,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <BrainIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3">
                          {module.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {module.sessions} sessions completed
                        </Typography>
                      </Box>
                      <Chip
                        label={`+${module.current - module.baseline}%`}
                        color="success"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Current Performance</Typography>
                        <Typography variant="body2">{module.current}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={module.current}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: module.color,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Baseline: {module.baseline}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: module.color, fontWeight: 600 }}>
                        {((module.current - module.baseline) / module.baseline * 100).toFixed(1)}% improvement
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Recent Training Sessions
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Training Module</TableCell>
                      <TableCell align="center">Duration</TableCell>
                      <TableCell align="center">Score</TableCell>
                      <TableCell align="center">Improvement</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{formatDate(session.date)}</TableCell>
                        <TableCell>{session.module}</TableCell>
                        <TableCell align="center">{session.duration} min</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${session.score}%`}
                            color={session.score >= 90 ? 'success' : session.score >= 80 ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: getImprovementColor(session.improvement),
                            }}
                          >
                            <span style={{ marginRight: 4 }}>
                              {getImprovementIcon(session.improvement)}
                            </span>
                            {Math.abs(session.improvement)}%
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {selectedTab === 2 && (
          <Grid container spacing={3}>
            {achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    opacity: achievement.earned ? 1 : 0.6,
                    border: achievement.earned ? `2px solid ${theme.palette.primary.main}` : 'none',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: achievement.earned ? theme.palette.primary.main : theme.palette.grey[400],
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {achievement.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {achievement.description}
                    </Typography>
                    {achievement.earned ? (
                      <Chip
                        label={`Earned ${formatDate(achievement.date!)}`}
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        label="Not earned yet"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedTab === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Performance Trends
              </Typography>
              {/* Placeholder for charts */}
              <Box
                sx={{
                  height: 400,
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px dashed ${theme.palette.grey[300]}`,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <ShowChartIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Performance Trend Charts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detailed analytics and trend visualization would appear here
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default Progress;