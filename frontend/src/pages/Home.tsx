import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to the Cognitive Retraining Platform
      </Typography>
      <Typography variant="body1" gutterBottom>
        Help children improve cognitive skills through engaging training modules and EEG monitoring.
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate('/register')}>
        Get Started
      </Button>
    </Container>
  );
};

export default Home;