import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Slider,
  Card,
  CardContent,
  CardMedia,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const EvaluationPage = () => {
  const [propertyData, setPropertyData] = useState({
    surface: 80,
    rooms: 3,
    location: '',
    floor: 3,
    parking: true,
    elevator: true,
    balcony: true
  });

  const [estimatedPrice, setEstimatedPrice] = useState(null);

  // Prix moyens par m² selon le quartier
  const pricesByArea = {
    'Tel Aviv - Centre': 65000,
    'Herzliya': 45000,
    'Ramat Gan': 35000,
    'Bat Yam': 25000
  };

  const handleEstimate = () => {
    const basePrice = pricesByArea[propertyData.location] || 30000;
    const totalPrice = basePrice * propertyData.surface;
    
    // Ajustements
    const adjustments = {
      elevator: 50000,
      parking: 150000,
      balcony: 100000,
      floor: propertyData.floor * 10000
    };

    const finalPrice = totalPrice + 
      (propertyData.elevator ? adjustments.elevator : 0) +
      (propertyData.parking ? adjustments.parking : 0) +
      (propertyData.balcony ? adjustments.balcony : 0) +
      adjustments.floor;

    setEstimatedPrice(finalPrice);
  };

  // Exemples de propriétés similaires
  const similarProperties = [
    {
      title: "Appartement moderne",
      location: "Tel Aviv - Centre",
      price: 3500000,
      surface: 85,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },
    {
      title: "Vue sur mer",
      location: "Herzliya",
      price: 4200000,
      surface: 90,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Évaluation de bien immobilier
      </Typography>

      <Grid container spacing={4}>
        {/* Formulaire d'évaluation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Caractéristiques du bien
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Localisation"
                  value={propertyData.location}
                  onChange={(e) => setPropertyData({...propertyData, location: e.target.value})}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Sélectionnez une zone</option>
                  {Object.keys(pricesByArea).map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Surface (m²)</Typography>
                <Slider
                  value={propertyData.surface}
                  onChange={(e, newValue) => setPropertyData({...propertyData, surface: newValue})}
                  min={20}
                  max={200}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Nombre de pièces</Typography>
                <Slider
                  value={propertyData.rooms}
                  onChange={(e, newValue) => setPropertyData({...propertyData, rooms: newValue})}
                  min={1}
                  max={8}
                  step={0.5}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleEstimate}
                  size="large"
                >
                  Estimer le prix
                </Button>
              </Grid>
            </Grid>

            {estimatedPrice && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Estimation
                </Typography>
                <Typography variant="h4" color="primary">
                  ₪{estimatedPrice.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Biens similaires */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Biens similaires dans la zone
          </Typography>
          
          <Grid container spacing={2}>
            {similarProperties.map((property, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={property.image}
                    alt={property.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {property.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        {property.location}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                      ₪{property.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      {property.surface} m²
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EvaluationPage; 