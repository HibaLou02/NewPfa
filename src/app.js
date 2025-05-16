const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const config = require('./config/config');
const connectDB = require('./config/database');
const logger = require('./utils/logger');

// Initialisation de l'application Express
const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Cabinet Médical',
      version: '1.0.0',
      description: 'API de gestion du cabinet médical',
      contact: {
        name: 'Support',
        email: 'support@cabinet-medical.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes principales
app.use('/api/auth', require('./routes/auth.routes'));

// Servir les fichiers statiques du client en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware de gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Démarrage du serveur
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT} en mode ${config.nodeEnv}`);
  logger.info(`Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
});

module.exports = app; 