const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const logger = require('./config/logger');
const swaggerSpecs = require('./config/swagger');
const connectDB = require('./config/database');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();

// Configuration de l'environnement
const isTestEnv = process.env.NODE_ENV === 'test';
process.env.JWT_SECRET = isTestEnv ? 'test_secret_key' : process.env.JWT_SECRET;

// Import des routes
const authRoutes = require('./routes/authRoutes');
const patientAuthRoutes = require('./routes/patientAuthRoutes');
const patientRoutes = require('./routes/patientRoutes');
const rendezVousRoutes = require('./routes/rendezVousRoutes');
const traitementRoutes = require('./routes/traitementRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Configuration CORS
const corsOptions = {
  origin: true, // Permet toutes les origines en développement
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Documentation API Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patient-auth', patientAuthRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/rendez-vous', rendezVousRoutes);
app.use('/api/traitements', traitementRoutes);
app.use('/api/documents', documentRoutes);

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static('uploads'));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de gestion des patients' });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  logger.warn(`Route non trouvée: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error('Erreur serveur:', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  res.status(500).json({ 
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Démarrage du serveur uniquement si ce n'est pas un test
if (!isTestEnv) {
  // Database connection
  connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db')
    .then(() => {
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      logger.error('Failed to start server:', error);
      process.exit(1);
    });
}

module.exports = app; 