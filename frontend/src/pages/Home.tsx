import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { Psychology, Monitor, TrendingUp, School } from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'EEG Training',
      description: 'Advanced brain-computer interface training modules designed to enhance cognitive performance.',
    },
    {
      icon: <Monitor sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-time Monitoring',
      description: 'Live EEG monitoring with detailed analytics and performance tracking.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Progress Tracking',
      description: 'Comprehensive progress reports and performance analytics to monitor your improvement.',
    },
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Expert Guidance',
      description: 'Professional training modules with step-by-step guidance for optimal results.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Master Your Mind
              </Typography>
              <Typography variant="h5" paragraph>
                Advanced EEG training platform for cognitive enhancement and brain-computer interface mastery.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ mr: 2, mb: 2 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 300,
                }}
              >
                <Psychology sx={{ fontSize: 200, opacity: 0.3 }} />
                              </Box>
              </Grid>
            </Grid>
          </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph>
          Comprehensive EEG training with cutting-edge technology
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Paper sx={{ py: 6, backgroundColor: 'grey.50' }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Transform Your Cognitive Performance?
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Join thousands of users who have already enhanced their brain-computer interface skills.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mt: 2 }}
            >
              Start Your Journey Today
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home;