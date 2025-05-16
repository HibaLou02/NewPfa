const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const diagnosticController = require('../controllers/diagnosticController');

// Middleware de validation pour les données de diagnostic
const validateDiagnosticData = [
  check('patientId').isMongoId().withMessage('ID patient invalide'),
  check('type').isIn(['VITAL_SIGNS', 'IMAGERY', 'LAB_RESULTS']).withMessage('Type de diagnostic invalide'),
  check('data').isObject().withMessage('Les données doivent être un objet'),
  check('device').optional().isObject().withMessage('Les informations du dispositif doivent être un objet')
];

// Routes protégées par authentification
router.use(auth);

// Créer de nouvelles données diagnostiques
router.post(
  '/',
  validateDiagnosticData,
  diagnosticController.createDiagnosticData
);

// Récupérer les données diagnostiques d'un patient
router.get(
  '/patient/:patientId',
  diagnosticController.getPatientDiagnosticData
);

// Mettre à jour des données diagnostiques
router.put(
  '/:id',
  [check('data').isObject().withMessage('Les données doivent être un objet')],
  diagnosticController.updateDiagnosticData
);

// Supprimer des données diagnostiques
router.delete(
  '/:id',
  diagnosticController.deleteDiagnosticData
);

// Obtenir des statistiques sur les données diagnostiques
router.get(
  '/stats',
  diagnosticController.getDiagnosticStats
);

module.exports = router; 