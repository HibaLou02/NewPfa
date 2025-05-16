const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  addAntecedent,
  getPatientStats,
} = require('../controllers/patient.controller');

/**
 * @swagger
 * /api/patients:
 *   get:
 *     tags: [Patients]
 *     summary: Obtenir tous les patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher par nom ou prénom
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: medecinId
 *         schema:
 *           type: string
 *         description: ID du médecin traitant
 */
router.get('/', protect, getPatients);

/**
 * @swagger
 * /api/patients/stats:
 *   get:
 *     tags: [Patients]
 *     summary: Obtenir les statistiques des patients
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', protect, getPatientStats);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Obtenir un patient par ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', protect, getPatient);

/**
 * @swagger
 * /api/patients:
 *   post:
 *     tags: [Patients]
 *     summary: Créer un nouveau patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - nom
 *               - dateNaissance
 *               - sexe
 *               - telephone
 *               - medecinTraitant
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *               sexe:
 *                 type: string
 *                 enum: [M, F]
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *               adresse:
 *                 type: object
 *                 properties:
 *                   rue:
 *                     type: string
 *                   ville:
 *                     type: string
 *                   codePostal:
 *                     type: string
 *                   pays:
 *                     type: string
 *               medecinTraitant:
 *                 type: string
 */
router.post('/', protect, authorize('ADMIN', 'MEDECIN', 'SECRETAIRE'), createPatient);

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     tags: [Patients]
 *     summary: Mettre à jour un patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', protect, authorize('ADMIN', 'MEDECIN'), updatePatient);

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     tags: [Patients]
 *     summary: Supprimer un patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', protect, authorize('ADMIN'), deletePatient);

/**
 * @swagger
 * /api/patients/{id}/antecedents:
 *   post:
 *     tags: [Patients]
 *     summary: Ajouter un antécédent médical
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [MALADIE, CHIRURGIE, ALLERGIE, AUTRE]
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 */
router.post('/:id/antecedents', protect, authorize('ADMIN', 'MEDECIN'), addAntecedent);

module.exports = router; 