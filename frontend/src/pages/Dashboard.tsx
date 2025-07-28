import React from 'react';
import { Container, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        {user ? `Welcome back, ${user.firstName}!` : 'Loading...'}
      </Typography>
    </Container>
  );
};

export default Dashboard;