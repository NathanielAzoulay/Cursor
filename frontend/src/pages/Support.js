import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import Chat from '../components/Chat';

const Support = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Support
        </Typography>
        <Typography variant="body1" paragraph>
          Besoin d'aide ? Discutez avec notre équipe en direct.
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Chat />
        </Paper>
      </Box>
    </Container>
  );
};

export default Support; 