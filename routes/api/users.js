const express = require('express');
const router = express.Router();
const private = require('../../middlewares/checkJWT');
const userController = require('../../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs du port de plaisance Russell
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique généré par MongoDB
 *         username:
 *           type: string
 *           description: Nom complet de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email unique de l'utilisateur
 *         password:
 *           type: string
 *           description: Mot de passe (minimum 8 caractères, avec au moins un chiffre)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création automatique
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour automatique
 *       example:
 *         _id: "673a8b79b1c4f6d5a97a1e01"
 *         username: "Jean Dupont"
 *         email: "jean.dupont@example.com"
 *         password: "$2b$10$abcdeHasheduMotDePasse"
 *         createdAt: "2025-10-24T10:12:00.000Z"
 *         updatedAt: "2025-10-24T10:12:00.000Z"
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur existant
 *     tags: [Users]
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
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *               password:
 *                 type: string
 *                 example: "motdepasse123"
 *     responses:
 *       200:
 *         description: Connexion réussie (JWT renvoyé)
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/logout:
 *   get:
 *     summary: Déconnexion de l'utilisateur (invalide le token JWT côté client)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.get('/logout', userController.logout);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste complète des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Claire Martin"
 *               email:
 *                 type: string
 *                 example: "claire.martin@example.com"
 *               password:
 *                 type: string
 *                 example: "portRussell2025"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides ou email déjà utilisé
 */
router.get('/', private, userController.getAllUsers);
router.post('/', private, userController.addUser);

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Récupère un utilisateur via son email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Adresse email de l'utilisateur à rechercher
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *   put:
 *     summary: Met à jour un utilisateur existant via son email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Claire Dubois"
 *               password:
 *                 type: string
 *                 example: "NouveauMDP2025"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 *   delete:
 *     summary: Supprime un utilisateur via son email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:email', private, userController.getUserByEmail);
router.put('/:email', private, userController.updateUser);
router.delete('/:email', private, userController.deleteUser);

module.exports = router;