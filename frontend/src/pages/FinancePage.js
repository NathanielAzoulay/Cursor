import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  DownloadOutlined,
  NotificationsActive,
  AccountBalance,
  TrendingUp,
  Assignment
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Line } from 'react-chartjs-2';

const FinancePage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [financialData, setFinancialData] = useState({
    monthlyIncome: 45000,
    yearlyExpenses: 120000,
    taxAmount: 35000,
    netProfit: 385000
  });

  // Données pour le graphique des revenus
  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Revenus mensuels (₪)',
      data: [42000, 43500, 45000, 44000, 46000, 45000],
      borderColor: '#2196f3',
      tension: 0.4
    }]
  };

  // Données pour le tableau des transactions
  const transactions = [
    { date: '2024-03-15', type: 'Revenu', description: 'Loyer Apt. Tel Aviv', amount: 15000 },
    { date: '2024-03-10', type: 'Dépense', description: 'Maintenance', amount: -2500 },
    { date: '2024-03-05', type: 'Taxe', description: 'Impôt foncier', amount: -5000 }
  ];

  useEffect(() => {
    // Simuler des notifications
    setNotifications([
      { id: 1, type: 'warning', message: 'Contrat de location expirant dans 30 jours' },
      { id: 2, type: 'info', message: 'Augmentation des prix de 5% dans le quartier Florentin' }
    ]);
  }, []);

  const generateReport = () => {
    // Logique pour générer un rapport PDF
    console.log('Génération du rapport...');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion Financière
      </Typography>

      {/* Notifications */}
      <Box sx={{ mb: 4 }}>
        {notifications.map((notif) => (
          <Alert 
            key={notif.id} 
            severity={notif.type}
            sx={{ mb: 1 }}
            icon={<NotificationsActive />}
          >
            {notif.message}
          </Alert>
        ))}
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenus Mensuels</Typography>
              </Box>
              <Typography variant="h4">₪{financialData.monthlyIncome.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Dépenses Annuelles</Typography>
              </Box>
              <Typography variant="h4">₪{financialData.yearlyExpenses.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Impôts</Typography>
              </Box>
              <Typography variant="h4">₪{financialData.taxAmount.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Bénéfice Net</Typography>
              </Box>
              <Typography variant="h4">₪{financialData.netProfit.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphique des revenus */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Évolution des revenus</Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadOutlined />}
            onClick={generateReport}
          >
            Générer un rapport
          </Button>
        </Box>
        <Box sx={{ height: 300 }}>
          <Line data={revenueData} options={{ maintainAspectRatio: false }} />
        </Box>
      </Paper>

      {/* Tableau des transactions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dernières transactions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Montant</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: transaction.amount > 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    ₪{Math.abs(transaction.amount).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default FinancePage; 