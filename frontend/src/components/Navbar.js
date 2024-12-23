import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AddPropertyDialog = ({ open, handleClose, handleSubmit }) => {
  const [property, setProperty] = useState({
    title: '',
    price: '',
    surface: '',
    rooms: '',
    type: 'apartment',
    address: {
      street: '',
      city: '',
      neighborhood: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProperty(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProperty(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(property);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Ajouter une propriété
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre"
                name="title"
                value={property.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix"
                name="price"
                type="number"
                value={property.price}
                onChange={handleChange}
                required
                InputProps={{ startAdornment: '₪' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Surface (m²)"
                name="surface"
                type="number"
                value={property.surface}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de pièces"
                name="rooms"
                type="number"
                value={property.rooms}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Type de bien"
                name="type"
                value={property.type}
                onChange={handleChange}
                required
              >
                <MenuItem value="apartment">Appartement</MenuItem>
                <MenuItem value="house">Maison</MenuItem>
                <MenuItem value="penthouse">Penthouse</MenuItem>
                <MenuItem value="studio">Studio</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rue"
                name="address.street"
                value={property.address.street}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ville"
                name="address.city"
                value={property.address.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quartier"
                name="address.neighborhood"
                value={property.address.neighborhood}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit" variant="contained">Ajouter</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddProperty = async (propertyData) => {
    try {
      const token = await currentUser.getIdToken();
      console.log('Token obtenu:', token);
      
      const formattedData = {
        title: propertyData.title,
        details: {
          price: Number(propertyData.price),
          surface: Number(propertyData.surface),
          rooms: Number(propertyData.rooms),
          type: propertyData.type,
          status: 'available'
        },
        address: propertyData.address
      };

      const apiUrl = `${process.env.REACT_APP_API_URL}/properties`;
      console.log('URL API:', apiUrl);
      console.log('Données envoyées:', formattedData);

      // Test de connexion basique
      try {
        const testResponse = await axios.get(process.env.REACT_APP_API_URL);
        console.log('Test de connexion réussi:', testResponse);
      } catch (testError) {
        console.error('Test de connexion échoué:', testError);
      }

      const response = await axios.post(
        apiUrl,
        formattedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Réponse du serveur:', response);
      
      if (response.status === 201) {
        alert('Propriété ajoutée avec succès!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      alert(`Erreur: ${error.response?.data?.message || error.message || 'Erreur de connexion au serveur'}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'black' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          REN
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {currentUser ? (
            <>
              <Button 
                color="inherit"
                variant="outlined"
                onClick={() => setOpenAddDialog(true)}
              >
                Ajouter un bien
              </Button>
              <Button 
                color="inherit"
                variant="outlined"
                onClick={handleLogout}
              >
                Se déconnecter
              </Button>
            </>
          ) : (
            <Button 
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </Button>
          )}
        </Box>
      </Toolbar>
      <AddPropertyDialog
        open={openAddDialog}
        handleClose={() => setOpenAddDialog(false)}
        handleSubmit={handleAddProperty}
      />
    </AppBar>
  );
};

export default Navbar; 