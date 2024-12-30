const admin = require('firebase-admin');
const User = require('../models/User');
const serviceAccount = require('../config/firebase-service-account.json');

// Vérifier si Firebase Admin n'est pas déjà initialisé
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n')
      })
    });
    console.log('Firebase Admin initialisé avec succès');
  } catch (error) {
    console.error('Erreur d\'initialisation Firebase Admin:', error);
    throw error;
  }
}

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ uid: decodedToken.uid });
    
    if (!user) {
      const firebaseUser = await admin.auth().getUser(decodedToken.uid);
      user = await User.create({
        uid: decodedToken.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        properties: []
      });
    }

    req.user = decodedToken;
    req.mongoUser = user;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(401).json({ message: 'Token invalide: ' + error.message });
  }
};

module.exports = verifyToken; 