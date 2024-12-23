const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ren-project1-default-rtdb.europe-west1.firebasedatabase.app"
});

module.exports = admin; 