import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';

const AnalyticsPage = () => {
  // Données simulées pour le portefeuille
  const portfolioData = {
    totalValue: 15000000,
    monthlyIncome: 45000,
    yearlyGrowth: 3.5,
    properties: 3
  };

  // Configuration du graphique de performance
  const performanceData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Valeur du portefeuille',
        data: [14200000, 14400000, 14600000, 14800000, 14900000, 15000000],
        borderColor: '#9c27b0',
        tension: 0.4
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
        text: 'Évolution de votre portefeuille'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₪${(value/1000000).toFixed(1)}M`
        }
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Analyse de votre portefeuille
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <div>
                <Typography variant="h6">Valeur totale</Typography>
                <Typography variant="h4">₪{(portfolioData.totalValue/1000000).toFixed(1)}M</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <div>
                <Typography variant="h6">Revenus mensuels</Typography>
                <Typography variant="h4">₪{portfolioData.monthlyIncome.toLocaleString()}</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <div>
                <Typography variant="h6">Croissance annuelle</Typography>
                <Typography variant="h4">{portfolioData.yearlyGrowth}%</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Graphique de performance */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ height: 400 }}>
          <Line data={performanceData} options={options} />
        </Box>
      </Paper>

      {/* Suggestions d'investissement */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Suggestions d'investissement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tel Aviv - Florentin
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Quartier en pleine expansion avec un potentiel de croissance de 5% par an
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Potentiel de croissance
                </Typography>
                <LinearProgress variant="determinate" value={80} color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Herzliya - Marina
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Zone premium avec une forte demande locative
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Potentiel de croissance
                </Typography>
                <LinearProgress variant="determinate" value={70} color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ramat Gan
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Nouveau quartier d'affaires en développement
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Potentiel de croissance
                </Typography>
                <LinearProgress variant="determinate" value={90} color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage; 