const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    console.log('URI:', config.mongoUri);
    
    const conn = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected:', conn.connection.host);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test de la connexion
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections disponibles:', collections.map(c => c.name));

    // Gestion des événements de la connexion
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 