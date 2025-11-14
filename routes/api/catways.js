const express = require('express');
const router = express.Router();
const authApi = require('../../middlewares/authAPI');
const catwayController = require('../../controllers/catwayController');

router.use(authApi);

router.get('/test', async (req, res) => {
  res.json({ message: "Route catways OK" });
});

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways (emplacements pour bateaux)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Catway:
 *       type: object
 *       properties:
 *         catwayNumber:
 *           type: number
 *           example: 12
 *         catwayType:
 *           type: string
 *           enum: [short, long]
 *           example: long
 *         catwayState:
 *           type: string
 *           example: "bon état"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-24T10:12:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-24T10:12:00.000Z"
 *
 *     CatwayInput:
 *       type: object
 *       properties:
 *         catwayNumber:
 *           type: number
 *           example: 12
 *         catwayType:
 *           type: string
 *           enum: [short, long]
 *           example: long
 *         catwayState:
 *           type: string
 *           example: "bon état"
 *       required:
 *         - catwayNumber
 *         - catwayType
 *         - catwayState
 *
 *     CatwayUpdate:
 *       type: object
 *       properties:
 *         catwayState:
 *           type: string
 *           example: "En cours de réparation"
 *       required:
 *         - catwayState
 */

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Récupère tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste de tous les catways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 *   post:
 *     summary: Ajoute un nouveau catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CatwayInput'
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 */
router.get('/', authApi, catwayController.getAllCatways);
router.post('/', authApi, catwayController.addCatway);

/**
 * @swagger
 * /api/catways/{id}:
 *   get:
 *     summary: Récupère un catway par son numéro
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway à récupérer
 *     responses:
 *       200:
 *         description: Catway trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway non trouvé
 *
 * 
 *   put:
 *     summary: Met à jour uniquement l'état (`catwayState`) d'un catway par son numéro
 *     description: >
 *       ⚠️ Seul le champ **`catwayState`** peut être modifié.<br><br>
 *       💡 Pour connaître la valeur actuelle avant modification, effectuez d'abord un **GET /api/catways/{id}**.<br><br>
 *       Exemple de valeurs possibles :
 *       - "bon état"
 *       - "En cours de réparation"
 *       - "des taches de peinture"
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState:
 *                 type: string
 *                 description: Nouvel état du catway
 *                 example: "bon état"
 *     responses:
 *       200:
 *         description: Catway mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Catway non trouvé"
 * 
 *   delete:
 *     summary: Supprime un catway par son numéro
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway à supprimer
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Catway 12 supprimé avec succès"
 *       404:
 *         description: Catway non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Catway non trouvé"
 */
router.get('/:id', authApi, catwayController.getCatwayById);
router.put('/:id', authApi, catwayController.updateCatway);
router.delete('/:id', authApi, catwayController.deleteCatway);

module.exports = router;