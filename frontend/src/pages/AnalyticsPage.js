import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import MarketChart from '../components/MarketChart';

const AnalyticsPage = () => {
  const [marketData, setMarketData] = useState({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    values: [100, 120, 115, 134, 168, 175]
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Analyses du marché
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <MarketChart data={marketData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AnalyticsPage; 