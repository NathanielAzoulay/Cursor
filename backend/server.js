const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Configurer mongoose
mongoose.set('strictQuery', false);

const app = express();
let server = null; // Pour garder une référence au serveur

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Initialiser Firebase Admin si ce n'est pas déjà fait
if (!admin.apps.length) {
  const serviceAccount = require('./config/firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialisé avec succès');
}

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

// Fonction pour démarrer le serveur Express
const startServer = () => {
  if (server) {
    console.log('Le serveur est déjà en cours d\'exécution');
    return;
  }
  
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Port déjà utilisé, tentative avec un autre port...');
      server.close();
      server = app.listen(0); // Utiliser un port disponible
    }
  });
};

// Configuration MongoDB avec retry
const connectWithRetry = () => {
  if (mongoose.connection.readyState === 1) {
    console.log('Déjà connecté à MongoDB');
    return;
  }

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    authSource: 'admin'
  })
  .then(() => {
    console.log('✅ Connecté à MongoDB avec succès');
    startServer();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    console.log('Nouvelle tentative dans 5 secondes...');
    setTimeout(connectWithRetry, 5000);
  });
};

// Gérer la déconnexion MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB déconnecté - tentative de reconnexion...');
  if (server) {
    server.close(() => {
      console.log('Serveur arrêté en raison de la déconnexion MongoDB');
    });
    server = null;
  }
  connectWithRetry();
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  if (server) {
    server.close(() => {
      console.log('Serveur arrêté');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Démarrer la connexion initiale
connectWithRetry(); 