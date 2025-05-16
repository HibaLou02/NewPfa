const express = require('express');
const router = express.Router();
const patientAuthController = require('../controllers/patientAuthController');
const { patientAuth } = require('../middleware/patientAuth');

// Routes publiques
router.post('/register', patientAuthController.registerPatient);
router.post('/login', patientAuthController.loginPatient);

// Routes protégées
router.get('/profile', patientAuth, patientAuthController.getPatientProfile);

module.exports = router; 