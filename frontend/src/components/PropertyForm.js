import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Typography,
  MenuItem,
  Input,
  CardMedia,
  CircularProgress 
} from '@mui/material';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PropertyForm = ({ onSubmit }) => {
  const [property, setProperty] = useState({
    title: '',
    address: '',
    details: {
      price: '',
      surface: '',
      rooms: '',
      type: 'apartment'
    }
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Créer les previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload des images
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `properties/${Date.now()}_${image.name}`);
          const snapshot = await uploadBytes(storageRef, image);
          return getDownloadURL(snapshot.ref);
        })
      );

      // Envoyer les données avec les URLs des images
      await onSubmit({
        ...property,
        images: imageUrls
      });

      // Réinitialiser le formulaire
      setProperty({
        title: '',
        address: '',
        details: {
          price: '',
          surface: '',
          rooms: '',
          type: 'apartment'
        }
      });
      setImages([]);
      setPreview([]);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'ajout de la propriété');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Informations générales</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Titre"
            value={property.title}
            onChange={(e) => setProperty({...property, title: e.target.value})}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Adresse"
            value={property.address}
            onChange={(e) => setProperty({...property, address: e.target.value})}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Prix"
            value={property.details.price}
            onChange={(e) => setProperty({
              ...property,
              details: {...property.details, price: e.target.value}
            })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Surface (m²)"
            value={property.details.surface}
            onChange={(e) => setProperty({
              ...property,
              details: {...property.details, surface: e.target.value}
            })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Nombre de pièces"
            value={property.details.rooms}
            onChange={(e) => setProperty({
              ...property,
              details: {...property.details, rooms: e.target.value}
            })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Type de bien"
            value={property.details.type}
            onChange={(e) => setProperty({
              ...property,
              details: {...property.details, type: e.target.value}
            })}
          >
            <MenuItem value="apartment">Appartement</MenuItem>
            <MenuItem value="house">Maison</MenuItem>
            <MenuItem value="studio">Studio</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Photos</Typography>
          <Input
            type="file"
            inputProps={{ 
              multiple: true, 
              accept: 'image/*',
              onChange: handleImageChange
            }}
          />
        </Grid>

        {preview.length > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {preview.map((url, index) => (
                <Grid item key={index} xs={4}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={url}
                    alt={`Preview ${index + 1}`}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Ajouter la propriété'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyForm; 