const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db');
    
    const adminData = {
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@cabinet.com',
      password: 'Admin123!',
      role: 'ADMIN',
      phoneNumber: '0600000000',
      active: true
    };

    // Vérifier si l'admin existe déjà
    let admin = await User.findOne({ email: adminData.email });
    
    if (admin) {
      console.log('L\'administrateur existe déjà. Mise à jour du compte...');
      admin.active = true;
      admin.firstName = adminData.firstName;
      admin.lastName = adminData.lastName;
      admin.role = adminData.role;
      admin.phoneNumber = adminData.phoneNumber;
      await admin.save();
      console.log('Compte administrateur mis à jour et activé avec succès !');
    } else {
      // Créer le nouvel admin
      admin = new User(adminData);
      await admin.save();
      console.log('Compte administrateur créé avec succès !');
    }

    console.log('Informations de connexion :');
    console.log('Email:', adminData.email);
    console.log('Mot de passe:', adminData.password);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin(); 