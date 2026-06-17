import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrainIcon from '@mui/icons-material/Psychology';
import MonitorIcon from '@mui/icons-material/Monitor';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: <BrainIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'EEG-Based Training',
      description: 'Advanced brain-computer interface technology for personalized cognitive enhancement.',
      action: 'Learn More',
    },
    {
      icon: <MonitorIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Real-time Monitoring',
      description: 'Monitor your brain activity and cognitive performance in real-time.',
      action: 'Start Monitoring',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: 'Progress Tracking',
      description: 'Track your cognitive improvement over time with detailed analytics.',
      action: 'View Progress',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      title: 'Training Modules',
      description: 'Structured training programs designed to enhance specific cognitive abilities.',
      action: 'Browse Modules',
    },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
          borderRadius: 4,
          mb: 6,
          mt: 4,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
          }}
        >
          CogniTrain EEG
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          Revolutionary EEG-based cognitive training platform that adapts to your brain's unique patterns
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{ px: 4, py: 1.5 }}
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Button>
          {!user && (
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ px: 4, py: 1.5 }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Platform Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" color="primary">
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Benefits Section */}
      <Box
        sx={{
          py: 6,
          px: 4,
          backgroundColor: theme.palette.grey[50],
          borderRadius: 4,
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Why Choose CogniTrain EEG?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Chip
              label="Scientifically Validated"
              color="primary"
              variant="outlined"
              sx={{ mb: 2, fontSize: '1rem', py: 2, px: 1 }}
            />
            <Typography variant="body1" color="text.secondary">
              Based on peer-reviewed neuroscience research and clinical studies
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip
              label="Personalized Training"
              color="secondary"
              variant="outlined"
              sx={{ mb: 2, fontSize: '1rem', py: 2, px: 1 }}
            />
            <Typography variant="body1" color="text.secondary">
              AI-powered algorithms adapt to your unique brain patterns and learning style
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip
              label="Real-time Feedback"
              color="success"
              variant="outlined"
              sx={{ mb: 2, fontSize: '1rem', py: 2, px: 1 }}
            />
            <Typography variant="body1" color="text.secondary">
              Instant feedback helps optimize your training sessions for maximum effectiveness
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;