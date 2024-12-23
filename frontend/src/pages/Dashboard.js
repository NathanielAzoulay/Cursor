import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    details: {
      price: '',
      surface: '',
      rooms: '',
      type: 'apartment'
    },
    address: ''
  });

  useEffect(() => {
    fetchProperties();
  }, [currentUser]);

  const fetchProperties = async () => {
    try {
      console.log('Récupération des propriétés...');
      const token = await currentUser.getIdToken();
      console.log('Token obtenu:', token);
      
      const response = await axios.get('http://localhost:5000/api/properties/my-properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Propriétés reçues:', response.data);
      setProperties(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      console.error('Détails:', error.response?.data);
    }
  };

  const handleAddProperty = async () => {
    try {
      if (!newProperty.title || !newProperty.address || 
          !newProperty.details.price || 
          !newProperty.details.surface || 
          !newProperty.details.rooms) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      const propertyData = {
        title: newProperty.title,
        address: newProperty.address,
        details: {
          price: Number(newProperty.details.price),
          surface: Number(newProperty.details.surface),
          rooms: Number(newProperty.details.rooms),
          type: 'apartment'
        }
      };

      console.log('Envoi de la propriété:', propertyData);
      
      const token = await currentUser.getIdToken();
      const response = await axios.post(
        'http://localhost:5000/api/properties',
        propertyData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Réponse:', response.data);
      
      setOpenDialog(false);
      fetchProperties();
      
      setNewProperty({
        title: '',
        details: {
          price: '',
          surface: '',
          rooms: '',
          type: 'apartment'
        },
        address: ''
      });

      alert('Propriété ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      alert('Erreur lors de l\'ajout: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${await currentUser.getIdToken()}`
        }
      });
      fetchProperties();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">
          Mes Propriétés
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Ajouter une propriété
        </Button>
      </Box>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={property.image || "https://source.unsplash.com/random/?apartment"}
                alt={property.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {property.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.address}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ₪{property.details.price.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  {property.details.surface}m² • {property.details.rooms} pièces
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDeleteProperty(property._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog d'ajout de propriété */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une propriété</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Titre"
              fullWidth
              value={newProperty.title}
              onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
            />
            <TextField
              label="Prix"
              type="number"
              fullWidth
              value={newProperty.details.price}
              onChange={(e) => setNewProperty({
                ...newProperty,
                details: {...newProperty.details, price: Number(e.target.value)}
              })}
            />
            <TextField
              label="Surface (m²)"
              type="number"
              fullWidth
              value={newProperty.details.surface}
              onChange={(e) => setNewProperty({
                ...newProperty,
                details: {...newProperty.details, surface: Number(e.target.value)}
              })}
            />
            <TextField
              label="Nombre de pièces"
              type="number"
              fullWidth
              value={newProperty.details.rooms}
              onChange={(e) => setNewProperty({
                ...newProperty,
                details: {...newProperty.details, rooms: Number(e.target.value)}
              })}
            />
            <TextField
              label="Adresse"
              fullWidth
              value={newProperty.address}
              onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleAddProperty} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 