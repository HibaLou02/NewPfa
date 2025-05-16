const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const users = [
  {
    nom: 'Alaoui',
    prenom: 'Mohammed',
    email: 'dr.alaoui@cabinet.com',
    password: 'Med123!@',
    role: 'medecin',
    specialite: 'Cardiologie',
    telephone: '0661234567',
    actif: true,
    horairesTravail: [
      { jour: 'lundi', debut: '09:00', fin: '17:00' },
      { jour: 'mardi', debut: '09:00', fin: '17:00' },
      { jour: 'mercredi', debut: '09:00', fin: '17:00' },
      { jour: 'jeudi', debut: '09:00', fin: '17:00' },
      { jour: 'vendredi', debut: '09:00', fin: '12:00' }
    ]
  },
  {
    nom: 'Benani',
    prenom: 'Sara',
    email: 'dr.benani@cabinet.com',
    password: 'Sara123!@',
    role: 'medecin',
    specialite: 'Pédiatrie',
    telephone: '0662345678',
    actif: true,
    horairesTravail: [
      { jour: 'lundi', debut: '09:00', fin: '17:00' },
      { jour: 'mardi', debut: '09:00', fin: '17:00' },
      { jour: 'mercredi', debut: '09:00', fin: '17:00' },
      { jour: 'jeudi', debut: '09:00', fin: '17:00' },
      { jour: 'vendredi', debut: '09:00', fin: '12:00' }
    ]
  },
  {
    nom: 'Rami',
    prenom: 'Fatima',
    email: 'infirmiere.rami@cabinet.com',
    password: 'Fatima123!@',
    role: 'infirmier',
    telephone: '0663456789',
    actif: true,
    horairesTravail: [
      { jour: 'lundi', debut: '08:30', fin: '16:30' },
      { jour: 'mardi', debut: '08:30', fin: '16:30' },
      { jour: 'mercredi', debut: '08:30', fin: '16:30' },
      { jour: 'jeudi', debut: '08:30', fin: '16:30' },
      { jour: 'vendredi', debut: '08:30', fin: '11:30' }
    ]
  },
  {
    nom: 'Karimi',
    prenom: 'Yasmine',
    email: 'secretaire.karimi@cabinet.com',
    password: 'Yasmine123!@',
    role: 'secretaire',
    telephone: '0664567890',
    actif: true,
    horairesTravail: [
      { jour: 'lundi', debut: '08:00', fin: '16:00' },
      { jour: 'mardi', debut: '08:00', fin: '16:00' },
      { jour: 'mercredi', debut: '08:00', fin: '16:00' },
      { jour: 'jeudi', debut: '08:00', fin: '16:00' },
      { jour: 'vendredi', debut: '08:00', fin: '11:00' }
    ]
  }
];

const createUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Création des utilisateurs...');

    for (const userData of users) {
      try {
        const user = new User(userData);
        await user.save();
        console.log(`✓ Utilisateur créé avec succès : ${userData.prenom} ${userData.nom} (${userData.role})`);
        console.log(`  Email: ${userData.email}`);
        console.log(`  Mot de passe: ${userData.password}\n`);
      } catch (error) {
        console.error(`✗ Erreur lors de la création de l'utilisateur ${userData.email}:`, error.message);
      }
    }

  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnexion de la base de données');
  }
};

createUsers(); 