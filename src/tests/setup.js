// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.PORT = 3001;

// Désactiver les logs pendant les tests
const logger = require('../config/logger');
logger.transports.forEach((t) => (t.silent = true)); 