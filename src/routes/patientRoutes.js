const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { patientSchema, updatePatientSchema } = require('../validations/patientValidation');
const patientController = require('../controllers/patientController');

// Routes protégées nécessitant une authentification
router.use(auth);

// Routes pour la gestion des patients
router.post('/', 
  checkRole(['admin', 'medecin', 'secretaire']),
  validate(patientSchema),
  patientController.createPatient
);

router.get('/', 
  checkRole(['admin', 'medecin', 'infirmier', 'secretaire']), 
  patientController.getAllPatients
);

router.get('/search', 
  checkRole(['admin', 'medecin', 'infirmier', 'secretaire']), 
  patientController.searchPatients
);

router.get('/:id', 
  checkRole(['admin', 'medecin', 'infirmier', 'secretaire']), 
  patientController.getPatientById
);

router.put('/:id', 
  checkRole(['admin', 'medecin']),
  validate(updatePatientSchema),
  patientController.updatePatient
);

router.delete('/:id', 
  checkRole(['admin']), 
  patientController.deletePatient
);

router.post('/:id/documents', 
  checkRole(['admin', 'medecin']), 
  patientController.addDocument
);

module.exports = router; 