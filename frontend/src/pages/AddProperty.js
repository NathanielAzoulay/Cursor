import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AddProperty = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (propertyData) => {
    try {
      await api.post('/properties', propertyData, {
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la propriété:', error);
      alert('Erreur lors de l\'ajout de la propriété');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ajouter une propriété
        </Typography>
        
        <PropertyForm onSubmit={handleSubmit} />
      </Box>
    </Container>
  );
};

export default AddProperty; 