const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - prenom
 *               - nom
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MEDECIN, SECRETAIRE]
 *               specialite:
 *                 type: string
 *               telephone:
 *                 type: string
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     tags: [Authentication]
 *     summary: Mettre à jour le profil utilisateur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               telephone:
 *                 type: string
 *               specialite:
 *                 type: string
 */
router.put('/me', protect, updateMe);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     tags: [Authentication]
 *     summary: Changer le mot de passe
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 */
router.put('/change-password', protect, changePassword);

module.exports = router; 