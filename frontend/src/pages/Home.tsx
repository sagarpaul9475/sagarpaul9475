import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Psychology, 
  Timeline, 
  Science,
  PlayArrow,
  School,
  Memory
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Memory sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Brain-Computer Interface',
      description: 'Advanced EEG monitoring and analysis for real-time brain activity tracking.'
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Cognitive Training',
      description: 'Personalized training modules designed to enhance cognitive abilities.'
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Progress Tracking',
      description: 'Comprehensive analytics and progress monitoring for continuous improvement.'
    },
    {
      icon: <Science sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Research-Based',
      description: 'Built on cutting-edge neuroscience research and proven methodologies.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Paper 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Unlock Your Brain's Potential
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Experience the future of cognitive enhancement with our advanced brain-computer interface technology.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate('/register')}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<School />}
                  onClick={() => navigate('/training')}
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Memory sx={{ fontSize: 200, opacity: 0.3 }} />
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
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Cutting-edge technology meets personalized cognitive enhancement
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
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
      <Paper sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Transform Your Cognitive Abilities?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of users who have already enhanced their brain performance
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'grey.100' }
              }}
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