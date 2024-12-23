const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Configurer mongoose
mongoose.set('strictQuery', false);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Configuration MongoDB avec gestion d'erreur améliorée
const connectDB = async () => {
  for (let i = 0; i < 5; i++) { // Essayer 5 fois
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000, // Augmenter le timeout
        socketTimeoutMS: 60000,
        serverSelectionTimeoutMS: 30000,
      });
      console.log('✅ Connecté à MongoDB avec succès');
      return true;
    } catch (err) {
      console.error(`❌ Tentative ${i + 1} échouée:`, err.message);
      if (i === 4) {
        console.error('Impossible de se connecter à MongoDB après 5 tentatives');
        return false;
      }
      // Attendre 5 secondes avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Démarrer le serveur seulement après une connexion réussie
const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } else {
    process.exit(1);
  }
};

// Routes
const propertiesRouter = require('./routes/properties');
app.use('/api/properties', propertiesRouter);

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ 
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Gérer la déconnexion MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB déconnecté - tentative de reconnexion...');
  startServer();
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur MongoDB:', err);
});

// Démarrer le serveur
startServer().catch(err => {
  console.error('Erreur de démarrage:', err);
  process.exit(1);
}); 