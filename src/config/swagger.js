const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion des Patients',
      version: '1.0.0',
      description: 'Documentation de l\'API de gestion des patients dans le secteur de la santé',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.js'], // Chemins vers les fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 