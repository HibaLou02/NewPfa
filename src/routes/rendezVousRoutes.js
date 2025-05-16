const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { patientAuth } = require('../middleware/patientAuth');
const checkRole = require('../middleware/checkRole');
const validate = require('../middleware/validation');
const { rendezVousSchema, updateRendezVousSchema } = require('../validations/rendezVousValidation');
const { getRendezVous, requestRendezVous, getPatientRendezVous, getAllRendezVous, createRendezVous, getRendezVousById, updateRendezVous, deleteRendezVous, confirmRendezVous } = require('../controllers/rendezVousController');

// Routes publiques
router.post('/request', patientAuth, requestRendezVous);

// Routes pour les patients (protégées)
router.get('/patient', 
  patientAuth,
  getPatientRendezVous
);

// Routes pour le personnel médical (protégées)
router.get('/', 
  auth, 
  checkRole(['admin', 'medecin', 'secretaire']),
  getRendezVous
);

router.post('/', 
  auth,
  checkRole(['admin', 'medecin', 'secretaire']),
  createRendezVous
);

router.get('/:id', 
  auth,
  checkRole(['admin', 'medecin', 'secretaire']),
  getRendezVousById
);

router.put('/:id', 
  auth,
  checkRole(['admin', 'medecin', 'secretaire']),
  updateRendezVous
);

router.delete('/:id', 
  auth,
  checkRole(['admin', 'medecin']),
  deleteRendezVous
);

router.post('/:id/confirm',
  auth,
  checkRole(['admin', 'medecin', 'secretaire']),
  confirmRendezVous
);

module.exports = router; 