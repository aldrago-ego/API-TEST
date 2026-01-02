// server.js

// -----------------------------------------------------------------------------
// 1. Importations
// -----------------------------------------------------------------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// -----------------------------------------------------------------------------
// 2. Initialisation de l'application
// -----------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------------------------------------------------------
// 3. Middlewares globaux
// -----------------------------------------------------------------------------
app.use(morgan('dev'));

// Autorise les requêtes du frontend (Angular)
app.use(cors());

// Permet de lire le JSON dans le body des requêtes
app.use(express.json());

// -----------------------------------------------------------------------------
// 4. Routes
// -----------------------------------------------------------------------------

// Route de test (publique)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur l’API XML Project. Le serveur est opérationnel 🚀'
  });
});

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));

// -----------------------------------------------------------------------------
// 5. Connexion à MongoDB et démarrage du serveur
// -----------------------------------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Échec de la connexion à MongoDB');
    console.error(err.message);
    process.exit(1);
  });

// -----------------------------------------------------------------------------
// 6. Gestionnaire d’erreurs global (optionnel mais recommandé)
// -----------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('🔥 Erreur serveur :', err.stack);
  res.status(500).json({
    msg: 'Erreur interne du serveur'
  });
});
