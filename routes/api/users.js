const express = require('express');
const router = express.Router();
const private = require('../../middlewares/checkJWT');
const userController = require('../../controllers/userController');

router.post('/login', userController.login);
router.get('/logout', userController.logout);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

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
 *         description: Liste des utilisateurs
 *   post:
 *     summary: Ajoute un nouvel utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.get('/', private, userController.getAllUsers);
router.post('/', private, userController.addUser);

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Récupère un utilisateur par email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l’utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:email', private, userController.getUserByEmail);
router.put('/:email', private, userController.updateUser);
router.delete('/:email', private, userController.deleteUser);

module.exports = router;