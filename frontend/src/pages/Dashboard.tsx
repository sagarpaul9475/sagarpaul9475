import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrainIcon from '@mui/icons-material/Psychology';
import MonitorIcon from '@mui/icons-material/Monitor';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Mock data - in a real app, this would come from your backend
  const stats = {
    totalSessions: 24,
    totalHours: 18.5,
    currentStreak: 7,
    avgScore: 85,
  };

  const recentActivities = [
    { title: 'Attention Training', date: '2 hours ago', score: 92 },
    { title: 'Memory Enhancement', date: 'Yesterday', score: 88 },
    { title: 'Focus Meditation', date: '2 days ago', score: 95 },
    { title: 'Cognitive Flexibility', date: '3 days ago', score: 79 },
  ];

  const quickActions = [
    {
      title: 'Start Training Session',
      description: 'Begin a personalized EEG training module',
      icon: <PlayArrowIcon />,
      color: theme.palette.primary.main,
      action: () => navigate('/training'),
    },
    {
      title: 'EEG Monitoring',
      description: 'View real-time brain activity monitoring',
      icon: <MonitorIcon />,
      color: theme.palette.secondary.main,
      action: () => navigate('/eeg-monitoring'),
    },
    {
      title: 'Progress Report',
      description: 'Analyze your cognitive improvement trends',
      icon: <TrendingUpIcon />,
      color: theme.palette.success.main,
      action: () => navigate('/progress'),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome back, {user?.firstName || 'User'}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Ready to enhance your cognitive performance today?
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid item container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <SchoolIcon />
                </Avatar>
                <Typography variant="h4" component="div" gutterBottom>
                  {stats.totalSessions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Training Sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <AccessTimeIcon />
                </Avatar>
                <Typography variant="h4" component="div" gutterBottom>
                  {stats.totalHours}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Training Time
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.success.main,
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <CalendarTodayIcon />
                </Avatar>
                <Typography variant="h4" component="div" gutterBottom>
                  {stats.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Day Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.warning.main,
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <EmojiEventsIcon />
                </Avatar>
                <Typography variant="h4" component="div" gutterBottom>
                  {stats.avgScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid item container spacing={4}>
          {/* Quick Actions */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid item container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.shadows[4],
                          },
                        }}
                        onClick={action.action}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: action.color,
                              width: 48,
                              height: 48,
                              mx: 'auto',
                              mb: 2,
                            }}
                          >
                            {action.icon}
                          </Avatar>
                          <Typography variant="h6" component="h3" gutterBottom>
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
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <BrainIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.title}
                          secondary={activity.date}
                        />
                        <Chip
                          label={`${activity.score}%`}
                          size="small"
                          color={activity.score >= 90 ? 'success' : activity.score >= 80 ? 'primary' : 'default'}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/progress')}>
                  View All Activity
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Progress Overview */}
        <Grid item container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Weekly Progress Overview
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Attention Training</Typography>
                    <Typography variant="body2">85%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={85} sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Memory Enhancement</Typography>
                    <Typography variant="body2">72%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={72} sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Cognitive Flexibility</Typography>
                    <Typography variant="body2">91%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={91} sx={{ mb: 2 }} />
                </Box>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/progress')}
                    startIcon={<TrendingUpIcon />}
                  >
                    View Detailed Progress
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;