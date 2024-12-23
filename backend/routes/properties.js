const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// Obtenir toutes les propriétés publiques
router.get('/', async (req, res) => {
  try {
    // Retourner uniquement les propriétés globales (sans owner)
    const properties = await Property.find({ owner: null })
      .sort('-createdAt');
    res.json([...globalProperties, ...properties]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir les propriétés publiques (non liées à un utilisateur)
router.get('/public', async (req, res) => {
  try {
    const properties = await Property.find({ owner: null })
      .sort('-createdAt');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir les propriétés d'un utilisateur spécifique
router.get('/my-properties', verifyToken, async (req, res) => {
  try {
    console.log('Recherche des propriétés pour l\'utilisateur:', req.user.uid);
    const properties = await Property.find({ owner: req.user.uid });
    console.log('Propriétés trouvées:', properties);
    res.json(properties);
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ajouter une nouvelle propriété
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Requête reçue:', {
      body: req.body,
      user: req.user,
      headers: req.headers
    });

    // Vérification des données requises
    if (!req.body.title || !req.body.details || !req.body.address) {
      return res.status(400).json({
        message: 'Données manquantes',
        required: ['title', 'details', 'address'],
        received: req.body
      });
    }

    const property = new Property({
      owner: req.user.uid,
      title: req.body.title,
      details: {
        price: req.body.details.price,
        surface: req.body.details.surface,
        rooms: req.body.details.rooms,
        type: req.body.details.type || 'apartment'
      },
      address: req.body.address
    });

    console.log('Propriété à sauvegarder:', property);

    const savedProperty = await property.save();
    console.log('Propriété sauvegardée:', savedProperty);

    // Ajouter la référence à l'utilisateur
    await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $push: { properties: savedProperty._id } }
    );

    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(400).json({
      message: error.message,
      details: error.errors || error
    });
  }
});

// Ajouter une route pour voir les propriétés d'un utilisateur avec les détails
router.get('/user-properties', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).populate('properties');
    res.json({
      user: {
        email: user.email,
        name: user.name
      },
      properties: user.properties
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour une propriété
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user.uid
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée ou accès non autorisé' });
    }

    Object.assign(property, req.body);
    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une propriété
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.uid
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée ou accès non autorisé' });
    }

    // Retirer la référence de la propriété dans le document de l'utilisateur
    await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $pull: { properties: req.params.id } }
    );

    res.json({ message: 'Propriété supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route de debug (à utiliser uniquement en développement)
router.get('/debug/all', async (req, res) => {
  try {
    const users = await User.find();
    const properties = await Property.find();
    
    res.json({
      users: users,
      properties: properties,
      counts: {
        users: users.length,
        properties: properties.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 