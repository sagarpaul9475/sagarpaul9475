import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Paper
} from '@mui/material';
import {
  Memory,
  Timeline,
  School,
  TrendingUp,
  PlayArrow,
  Assessment,
  Psychology
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - in a real app, this would come from API
  const stats = {
    totalSessions: 24,
    currentStreak: 7,
    averageScore: 85,
    totalModules: 12,
    completedModules: 8
  };

  const recentActivity = [
    {
      id: 1,
      type: 'training',
      title: 'Completed Focus Training Module',
      description: 'Achieved 92% accuracy in attention exercises',
      time: '2 hours ago',
      icon: <Psychology color="primary" />
    },
          {
        id: 2,
        type: 'eeg',
        title: 'EEG Session Completed',
        description: '30-minute brain activity monitoring session',
        time: '1 day ago',
        icon: <Memory color="secondary" />
      },
    {
      id: 3,
      type: 'assessment',
      title: 'Cognitive Assessment',
      description: 'Memory and processing speed evaluation',
      time: '3 days ago',
      icon: <Assessment color="success" />
    }
  ];

  const quickActions = [
    {
      title: 'Start Training',
      description: 'Begin a new cognitive training session',
      icon: <PlayArrow />,
      color: 'primary',
      action: () => navigate('/training')
    },
    {
      title: 'EEG Monitoring',
      description: 'Monitor your brain activity in real-time',
      icon: <Memory />,
      color: 'secondary',
      action: () => navigate('/eeg-monitoring')
    },
    {
      title: 'View Progress',
      description: 'Check your improvement over time',
      icon: <Timeline />,
      color: 'success',
      action: () => navigate('/progress')
    }
  ];

  const progressPercentage = (stats.completedModules / stats.totalModules) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName || 'User'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Continue your cognitive enhancement journey with today's activities
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Memory color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Sessions
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stats.totalSessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Brain training sessions completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Current Streak
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stats.currentStreak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days of consecutive training
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Average Score
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stats.averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall performance rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Modules Progress
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stats.completedModules}/{stats.totalModules}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {Math.round(progressPercentage)}% completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={action.action}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      py: 1.5
                    }}
                    fullWidth
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2" component="div">
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.paper' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                          <Chip 
                            label={activity.time} 
                            size="small" 
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Recommendations */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Today's Recommendation
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Based on your recent performance, we recommend focusing on memory enhancement exercises. 
            Your attention skills are strong, but memory training could help improve your overall cognitive profile.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<PlayArrow />}
            onClick={() => navigate('/training')}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Start Memory Training
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;