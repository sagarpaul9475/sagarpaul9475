import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  LinearProgress,
  Chip,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import {
  Psychology,
  TrendingUp,
  School,
  Monitor,
  PlayArrow,
  Assessment,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - in a real app, this would come from an API
  const stats = {
    totalSessions: 24,
    averageScore: 78,
    currentStreak: 5,
    totalModules: 8,
    completedModules: 3,
  };

  const recentActivity = [
    { id: 1, type: 'Training Session', title: 'Alpha Wave Training', score: 85, date: '2 hours ago' },
    { id: 2, type: 'Assessment', title: 'Cognitive Performance Test', score: 92, date: '1 day ago' },
    { id: 3, type: 'Training Session', title: 'Focus Enhancement', score: 76, date: '2 days ago' },
  ];

  const quickActions = [
    {
      title: 'Start Training',
      description: 'Begin a new EEG training session',
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      path: '/training',
    },
    {
      title: 'EEG Monitoring',
      description: 'View real-time brain activity',
      icon: <Monitor sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      path: '/eeg-monitoring',
    },
    {
      title: 'View Progress',
      description: 'Check your performance analytics',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/progress',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Continue your EEG training journey and track your cognitive enhancement progress.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Total Sessions</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.totalSessions}
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
                {stats.averageScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6">Current Streak</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.currentStreak} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Monitor sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6">Modules</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.completedModules}/{stats.totalModules}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overall Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={(stats.completedModules / stats.totalModules) * 100}
              sx={{ flexGrow: 1, mr: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              {Math.round((stats.completedModules / stats.totalModules) * 100)}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {stats.completedModules} of {stats.totalModules} modules completed
          </Typography>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ color: action.color, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Recent Activity
      </Typography>
      <Card>
        <CardContent>
          {recentActivity.map((activity) => (
            <Box
              key={activity.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #f0f0f0',
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <Box>
                <Typography variant="subtitle1">
                  {activity.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Chip
                    label={activity.type}
                    size="small"
                    color={activity.type === 'Training Session' ? 'primary' : 'secondary'}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {activity.date}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" color="primary">
                {activity.score}%
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;