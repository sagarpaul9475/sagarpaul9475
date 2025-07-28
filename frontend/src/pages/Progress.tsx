import React from 'react';
import { Container, Typography } from '@mui/material';

const Progress: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Typography variant="h4" gutterBottom>
      Progress
    </Typography>
    <Typography variant="body1">Coming soon...</Typography>
  </Container>
);

export default Progress;