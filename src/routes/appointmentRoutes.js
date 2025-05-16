const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

// Middleware de validation pour les rendez-vous
const validateAppointment = [
  check('patient').isMongoId().withMessage('ID patient invalide'),
  check('practitioner').isMongoId().withMessage('ID praticien invalide'),
  check('dateTime').isISO8601().withMessage('Date et heure invalides'),
  check('type').isIn(['CONSULTATION', 'SUIVI', 'DIAGNOSTIC']).withMessage('Type de rendez-vous invalide'),
  check('duration').optional().isInt({ min: 5 }).withMessage('Durée invalide')
];

// Routes protégées par authentification
router.use(auth);

// Créer un nouveau rendez-vous
router.post(
  '/',
  validateAppointment,
  appointmentController.createAppointment
);

// Récupérer les rendez-vous d'un patient
router.get(
  '/patient/:patientId',
  appointmentController.getPatientAppointments
);

// Récupérer les rendez-vous d'un praticien
router.get(
  '/practitioner/:practitionerId',
  appointmentController.getPractitionerAppointments
);

// Mettre à jour un rendez-vous
router.put(
  '/:id',
  [
    check('dateTime').optional().isISO8601().withMessage('Date et heure invalides'),
    check('type').optional().isIn(['CONSULTATION', 'SUIVI', 'DIAGNOSTIC']).withMessage('Type de rendez-vous invalide'),
    check('status').optional().isIn(['PLANIFIE', 'CONFIRME', 'ANNULE', 'TERMINE']).withMessage('Statut invalide')
  ],
  appointmentController.updateAppointment
);

// Annuler un rendez-vous
router.post(
  '/:id/cancel',
  [check('reason').notEmpty().withMessage('Motif d\'annulation requis')],
  appointmentController.cancelAppointment
);

// Vérifier la disponibilité d'un praticien
router.get(
  '/availability',
  [
    check('practitionerId').isMongoId().withMessage('ID praticien invalide'),
    check('date').isISO8601().withMessage('Date invalide')
  ],
  appointmentController.checkPractitionerAvailability
);

module.exports = router; 