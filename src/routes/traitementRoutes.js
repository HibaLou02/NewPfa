const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { patientAuth } = require('../middleware/patientAuth');
const validate = require('../middleware/validation');
const {
  traitementSchema,
  updateTraitementSchema,
  prescriptionSchema,
  suiviSchema,
  alerteMedicamentSchema
} = require('../validations/traitementValidation');
const traitementController = require('../controllers/traitementController');

// Routes protégées nécessitant une authentification
router.use(auth);

// Route spécifique pour les patients
router.get('/mes-traitements',
  patientAuth,
  traitementController.getTraitementsPatient
);

// Routes pour la gestion des traitements
router.post('/',
  checkRole(['admin', 'medecin']),
  validate(traitementSchema),
  traitementController.createTraitement
);

router.get('/patient/:patientId',
  checkRole(['admin', 'medecin', 'infirmier']),
  traitementController.getTraitementsPatient
);

router.get('/patient/:patientId/stats',
  checkRole(['admin', 'medecin']),
  traitementController.getStatistiquesPatient
);

router.get('/:id',
  checkRole(['admin', 'medecin', 'infirmier']),
  traitementController.getTraitement
);

router.put('/:id',
  checkRole(['admin', 'medecin']),
  validate(updateTraitementSchema),
  traitementController.updateTraitement
);

router.post('/:id/prescriptions',
  checkRole(['admin', 'medecin']),
  validate(prescriptionSchema),
  traitementController.ajouterPrescription
);

router.post('/:id/suivi',
  checkRole(['admin', 'medecin', 'infirmier']),
  validate(suiviSchema),
  traitementController.ajouterSuivi
);

router.post('/:id/alertes',
  checkRole(['admin', 'medecin', 'infirmier']),
  validate(alerteMedicamentSchema),
  traitementController.ajouterAlerteMedicament
);

router.patch('/:id/terminer',
  checkRole(['admin', 'medecin']),
  traitementController.terminerTraitement
);

module.exports = router; 