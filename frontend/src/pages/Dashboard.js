import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import axios from 'axios';

// Configuration du graphique
// const marketChartData = { ... };

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties/my-properties`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    if (currentUser) {
      fetchUserProperties();
    }
  }, [currentUser]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      <Grid container spacing={3}>
        {/* Statistiques rapides */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Valeur totale du portfolio</Typography>
              <Typography variant="h4">₪ 12.5M</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique d'évolution */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Évolution du marché</Typography>
            {/* Nous ajouterons le graphique plus tard */}
          </Paper>
        </Grid>

        {/* Liste des propriétés */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titre</TableCell>
                  <TableCell>Ville</TableCell>
                  <TableCell>Surface</TableCell>
                  <TableCell>Prix</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{property.address.city}</TableCell>
                    <TableCell>{property.details.surface} m²</TableCell>
                    <TableCell>₪ {property.details.price?.toLocaleString()}</TableCell>
                    <TableCell>{property.details.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 