const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
} = require('../controllers/appointment.controller');

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     tags: [Rendez-vous]
 *     summary: Obtenir tous les rendez-vous
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début de la période
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin de la période
 *       - in: query
 *         name: medecinId
 *         schema:
 *           type: string
 *         description: ID du médecin
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *         description: ID du patient
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [PLANIFIE, CONFIRME, EN_COURS, TERMINE, ANNULE]
 */
router.get('/', protect, getAppointments);

/**
 * @swagger
 * /api/appointments/stats:
 *   get:
 *     tags: [Rendez-vous]
 *     summary: Obtenir les statistiques des rendez-vous
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', protect, getAppointmentStats);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     tags: [Rendez-vous]
 *     summary: Obtenir un rendez-vous par ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', protect, getAppointment);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     tags: [Rendez-vous]
 *     summary: Créer un nouveau rendez-vous
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient
 *               - medecin
 *               - dateHeure
 *               - motif
 *             properties:
 *               patient:
 *                 type: string
 *               medecin:
 *                 type: string
 *               dateHeure:
 *                 type: string
 *                 format: date-time
 *               duree:
 *                 type: number
 *                 default: 30
 *               type:
 *                 type: string
 *                 enum: [CONSULTATION, SUIVI, URGENCE, AUTRE]
 *               motif:
 *                 type: string
 *               notes:
 *                 type: string
 */
router.post(
  '/',
  protect,
  authorize('ADMIN', 'MEDECIN', 'SECRETAIRE'),
  createAppointment
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     tags: [Rendez-vous]
 *     summary: Mettre à jour un rendez-vous
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put(
  '/:id',
  protect,
  authorize('ADMIN', 'MEDECIN', 'SECRETAIRE'),
  updateAppointment
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     tags: [Rendez-vous]
 *     summary: Supprimer un rendez-vous
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete(
  '/:id',
  protect,
  authorize('ADMIN', 'MEDECIN'),
  deleteAppointment
);

module.exports = router; 