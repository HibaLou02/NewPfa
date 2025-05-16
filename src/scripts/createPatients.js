const mongoose = require('mongoose');
const Patient = require('../models/Patient');
require('dotenv').config();

const patients = [
  {
    nom: 'El Amrani',
    prenom: 'Karim',
    dateNaissance: new Date('1985-03-15'),
    sexe: 'M',
    adresse: {
      rue: '123 Avenue Hassan II',
      ville: 'Casablanca',
      codePostal: '20000',
      pays: 'Maroc'
    },
    telephone: '0661234567',
    email: 'k.elamrani@email.com',
    numeroSecuriteSociale: 'CNSS123456',
    antecedentsMedicaux: [
      {
        type: 'Chirurgie',
        description: 'Appendicectomie',
        date: new Date('2010-06-20')
      },
      {
        type: 'Maladie chronique',
        description: 'Hypertension artérielle',
        date: new Date('2018-03-10')
      }
    ],
    allergies: [
      {
        nom: 'Pénicilline',
        severite: 'Severe',
        description: 'Réaction cutanée sévère'
      }
    ]
  },
  {
    nom: 'Bennis',
    prenom: 'Amina',
    dateNaissance: new Date('1992-08-25'),
    sexe: 'F',
    adresse: {
      rue: '45 Rue Mohammed V',
      ville: 'Rabat',
      codePostal: '10000',
      pays: 'Maroc'
    },
    telephone: '0662345678',
    email: 'a.bennis@email.com',
    numeroSecuriteSociale: 'CNSS234567',
    antecedentsMedicaux: [
      {
        type: 'Maladie',
        description: 'Asthme',
        date: new Date('2015-04-12')
      }
    ],
    allergies: [
      {
        nom: 'Pollen',
        severite: 'Moyenne',
        description: 'Rhinite allergique saisonnière'
      }
    ]
  },
  {
    nom: 'Tazi',
    prenom: 'Omar',
    dateNaissance: new Date('1978-11-30'),
    sexe: 'M',
    adresse: {
      rue: '78 Boulevard Zerktouni',
      ville: 'Marrakech',
      codePostal: '40000',
      pays: 'Maroc'
    },
    telephone: '0663456789',
    email: 'o.tazi@email.com',
    numeroSecuriteSociale: 'CNSS345678',
    antecedentsMedicaux: [
      {
        type: 'Maladie chronique',
        description: 'Diabète type 2',
        date: new Date('2016-09-15')
      }
    ],
    allergies: []
  },
  {
    nom: 'Alami',
    prenom: 'Nadia',
    dateNaissance: new Date('1995-04-18'),
    sexe: 'F',
    adresse: {
      rue: '156 Avenue des FAR',
      ville: 'Fès',
      codePostal: '30000',
      pays: 'Maroc'
    },
    telephone: '0664567890',
    email: 'n.alami@email.com',
    numeroSecuriteSociale: 'CNSS456789',
    antecedentsMedicaux: [],
    allergies: [
      {
        nom: 'Arachides',
        severite: 'Severe',
        description: 'Allergie alimentaire'
      }
    ]
  },
  {
    nom: 'Chraibi',
    prenom: 'Hassan',
    dateNaissance: new Date('1965-07-22'),
    sexe: 'M',
    adresse: {
      rue: '89 Rue Ibn Sina',
      ville: 'Tanger',
      codePostal: '90000',
      pays: 'Maroc'
    },
    telephone: '0665678901',
    email: 'h.chraibi@email.com',
    numeroSecuriteSociale: 'CNSS567890',
    antecedentsMedicaux: [
      {
        type: 'Chirurgie',
        description: 'Pontage coronarien',
        date: new Date('2019-11-05')
      },
      {
        type: 'Maladie chronique',
        description: 'Insuffisance cardiaque',
        date: new Date('2019-10-25')
      }
    ],
    allergies: [
      {
        nom: 'Aspirine',
        severite: 'Moyenne',
        description: 'Réaction gastrique'
      }
    ]
  }
];

const createPatients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Création des patients...\n');

    for (const patientData of patients) {
      try {
        const patient = new Patient(patientData);
        await patient.save();
        console.log(`✓ Patient créé avec succès : ${patientData.prenom} ${patientData.nom}`);
        console.log(`  Date de naissance: ${patientData.dateNaissance.toLocaleDateString()}`);
        console.log(`  Numéro de téléphone: ${patientData.telephone}`);
        console.log(`  Ville: ${patientData.adresse.ville}\n`);
      } catch (error) {
        console.error(`✗ Erreur lors de la création du patient ${patientData.nom}:`, error.message);
      }
    }

  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnexion de la base de données');
  }
};

createPatients(); 