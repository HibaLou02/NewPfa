const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Patient = require('../models/Patient');
const User = require('../models/User');
const connectDB = require('../config/database');

let mongoServer;
let token;
let testUser;

beforeAll(async () => {
  // Créer une instance de la base de données en mémoire
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connecter à la base de données de test
  await connectDB(mongoUri);

  // Créer un utilisateur de test
  const userData = {
    email: 'test@example.com',
    password: await bcrypt.hash('password123', 10),
    nom: 'Test',
    prenom: 'User',
    role: 'medecin',
    telephone: '0123456789',
    specialite: 'Généraliste'
  };

  testUser = await User.create(userData);
  
  // Générer le token
  token = jwt.sign(
    { userId: testUser._id },
    'test_secret_key',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Patient.deleteMany({});
});

describe('Patient API', () => {
  describe('POST /api/patients', () => {
    it('devrait créer un nouveau patient', async () => {
      const patientData = {
        nom: 'Dupont',
        prenom: 'Jean',
        dateNaissance: '1990-01-01',
        sexe: 'M',
        telephone: '0123456789',
        email: 'jean.dupont@example.com'
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.nom).toBe(patientData.nom);
      expect(response.body.prenom).toBe(patientData.prenom);
    });

    it('devrait retourner une erreur 400 pour des données invalides', async () => {
      const invalidData = {
        nom: '',
        prenom: '',
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/patients', () => {
    it('devrait retourner la liste des patients', async () => {
      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 