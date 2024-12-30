import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid
} from '@mui/material';
import { Line } from 'react-chartjs-2';

const FinancePage = () => {
  const [financialData] = useState({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    values: [1000, 1200, 1150, 1340, 1680, 1750]
  });

  const chartData = {
    labels: financialData.labels,
    datasets: [
      {
        label: 'Revenus mensuels',
        data: financialData.values,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution des revenus'
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Finance
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Line data={chartData} options={options} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FinancePage; 