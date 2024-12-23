import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Paper,
  Divider,
  Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MarketChart from '../components/MarketChart';
import axios from 'axios';

// Propriétés globales (visibles par tous)
const globalProperties = [
  {
    id: 1,
    title: "Penthouse de luxe avec vue sur mer",
    location: "Herzliya Pituach",
    price: 12500000,
    surface: 250,
    rooms: 5,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3",
    description: "Magnifique penthouse avec vue panoramique sur la mer Méditerranée"
  },
  {
    id: 2,
    title: "Appartement moderne au cœur de Tel Aviv",
    location: "Rothschild, Tel Aviv",
    price: 4800000,
    surface: 120,
    rooms: 3,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3",
    description: "Appartement rénové dans un immeuble Bauhaus historique"
  },
  {
    id: 3,
    title: "Villa de luxe avec piscine",
    location: "Caesarea",
    price: 15800000,
    surface: 400,
    rooms: 6,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3",
    description: "Villa exceptionnelle avec piscine à débordement et jardin paysager"
  }
];

const HomePage = () => {
  const [userProperties, setUserProperties] = useState([]);

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties/my-properties`);
        setUserProperties(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchUserProperties();
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', pt: 4, pb: 6 }}>
      <Container>
        {/* Section Introduction */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Bienvenue sur REN
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: '#424242' }}>
            Votre plateforme de gestion immobilière intelligente
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', backgroundColor: '#fff' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Suivez vos investissements
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Gérez votre portefeuille immobilier en temps réel
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', backgroundColor: '#fff' }}>
                <HomeIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Optimisez vos rendements
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Analysez les tendances du marché pour maximiser vos revenus
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Section Graphique */}
        <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Évolution du marché
          </Typography>
          <MarketChart />
        </Paper>

        {/* Section Propriétés sur le marché */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Propriétés sur le marché
        </Typography>
        <Grid container spacing={4}>
          {globalProperties.map((property) => (
            <Grid item xs={12} md={4} key={property.id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="240"
                  image={property.image}
                  alt={property.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {property.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {property.location}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {property.description}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ₪ {property.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    {property.surface} m² • {property.rooms} pièces
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 