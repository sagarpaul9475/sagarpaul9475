import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp,
  Memory,
  Psychology,
  Speed,
  Visibility,
  CalendarToday,
  Star,
  Timeline,
  Assessment,
  Download
} from '@mui/icons-material';

const Progress: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeRange, setTimeRange] = useState('30');

  // Mock data - in a real app, this would come from API
  const progressData = {
    overall: {
      score: 85,
      improvement: 12,
      sessions: 24,
      streak: 7
    },
    categories: [
      {
        name: 'Attention & Focus',
        score: 88,
        improvement: 15,
        sessions: 8,
        icon: <Visibility color="primary" />
      },
      {
        name: 'Memory Enhancement',
        score: 82,
        improvement: 8,
        sessions: 6,
        icon: <Memory color="secondary" />
      },
      {
        name: 'Processing Speed',
        score: 79,
        improvement: 18,
        sessions: 5,
        icon: <Speed color="success" />
      },
      {
        name: 'Cognitive Flexibility',
        score: 76,
        improvement: 22,
        sessions: 5,
        icon: <Psychology color="warning" />
      }
    ],
    recentSessions: [
      {
        id: 1,
        date: '2024-01-15',
        module: 'Sustained Attention',
        score: 92,
        duration: '15 min',
        improvement: '+5%'
      },
      {
        id: 2,
        date: '2024-01-14',
        module: 'Working Memory',
        score: 85,
        duration: '18 min',
        improvement: '+3%'
      },
      {
        id: 3,
        date: '2024-01-13',
        module: 'Reaction Time',
        score: 78,
        duration: '12 min',
        improvement: '+8%'
      },
      {
        id: 4,
        date: '2024-01-12',
        module: 'Pattern Recognition',
        score: 89,
        duration: '22 min',
        improvement: '+2%'
      }
    ],
    achievements: [
      {
        id: 1,
        title: 'Focus Master',
        description: 'Completed 10 attention training sessions',
        date: '2024-01-10',
        icon: <Star color="primary" />
      },
      {
        id: 2,
        title: 'Memory Champion',
        description: 'Achieved 90% accuracy in memory exercises',
        date: '2024-01-08',
        icon: <Star color="secondary" />
      },
      {
        id: 3,
        title: 'Speed Demon',
        description: 'Improved reaction time by 20%',
        date: '2024-01-05',
        icon: <Star color="success" />
      }
    ]
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getImprovementColor = (improvement: number) => {
    return improvement > 0 ? 'success' : 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Progress
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your cognitive enhancement journey
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />}>
            Export Data
          </Button>
        </Box>
      </Box>

      {/* Overall Progress Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Memory color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Overall Score
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {progressData.overall.score}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +{progressData.overall.improvement}% improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Sessions
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {progressData.overall.sessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Training sessions completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Current Streak
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {progressData.overall.streak}
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
                <Assessment color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Average Session
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                18m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Minutes per session
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Category Progress" />
          <Tab label="Recent Sessions" />
          <Tab label="Achievements" />
        </Tabs>

        {/* Category Progress Tab */}
        {selectedTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {progressData.categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'background.paper', mr: 1 }}>
                          {category.icon}
                        </Avatar>
                        <Typography variant="h6" component="div">
                          {category.name}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                        {category.score}%
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUp color="success" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="success.main">
                          +{category.improvement}% improvement
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {category.sessions} sessions
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={category.score} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Recent Sessions Tab */}
        {selectedTab === 1 && (
          <Box sx={{ p: 3 }}>
            <List>
              {progressData.recentSessions.map((session) => (
                <ListItem key={session.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Assessment />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={session.module}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {session.date} • {session.duration}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="h6" component="span" sx={{ mr: 2 }}>
                            Score: {session.score}%
                          </Typography>
                          <Chip 
                            label={session.improvement} 
                            size="small" 
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Achievements Tab */}
        {selectedTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {progressData.achievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {achievement.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="div">
                            {achievement.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Recommendations */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Personalized Recommendations
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Focus on Cognitive Flexibility
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your cognitive flexibility score is lower than other areas. 
                  Try the "Task Switching" and "Mental Flexibility" modules to improve.
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  Start Training
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'success.main', color: 'white' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Maintain Your Streak
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  You're on a 7-day streak! Keep it up by completing at least one training session today.
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'success.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  Continue Training
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Progress;