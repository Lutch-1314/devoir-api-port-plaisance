const express = require('express');
const router = express.Router({ mergeParams: true }); // important pour récupérer :id depuis /catways/:id
const private = require('../../middlewares/checkJWT');
const reservationController = require('../../controllers/reservationController');

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations (sous-ressource des catways)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID MongoDB de la réservation
 *         catwayNumber:
 *           type: number
 *           description: Numéro du catway concerné
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         boatName:
 *           type: string
 *           description: Nom du bateau
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Date de début de la réservation
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Date de fin de la réservation
 *       example:
 *         _id: 6728b812c43b53f0f015c230
 *         catwayNumber: 1
 *         clientName: "Thomas Martin"
 *         boatName: "Carolina"
 *         startDate: "2024-05-21T06:00:00Z"
 *         endDate: "2024-10-27T06:00:00Z"
 *
 *     ReservationInput:
 *       type: object
 *       required:
 *         - clientName
 *         - boatName
 *         - startDate
 *         - endDate
 *       properties:
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         boatName:
 *           type: string
 *           description: Nom du bateau
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Date de début de la réservation
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Date de fin de la réservation
 *       example:
 *         clientName: "Thomas Martin"
 *         boatName: "Carolina"
 *         startDate: "2024-05-21T06:00:00Z"
 *         endDate: "2024-10-27T06:00:00Z"
 */

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   get:
 *     summary: Récupère toutes les réservations pour un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Liste des réservations pour ce catway
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *   post:
 *     summary: Crée une nouvelle réservation pour un catway
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */

/**
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupère une réservation précise d’un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de la réservation
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation non trouvée
 *   put:
 *     summary: Met à jour une réservation existante
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de la réservation à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *       404:
 *         description: Réservation non trouvée
 *   delete:
 *     summary: Supprime une réservation d’un catway
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de la réservation à supprimer
 *     responses:
 *       204:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 */

// 🔹 Routes API REST (avec auth privée)
router.get('/', private, reservationController.getAllReservations);
router.post('/', private, reservationController.addReservation);
router.get('/:idReservation', private, reservationController.getReservationById);
router.put('/:idReservation', private, reservationController.updateReservation);
router.delete('/:idReservation', private, reservationController.deleteReservation);

module.exports = router;