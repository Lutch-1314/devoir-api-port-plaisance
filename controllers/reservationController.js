const reservationService = require('../services/reservationService');
const Catway = require('../models/catway');

// 🔹 Récupérer toutes les réservations d’un catway
exports.getAllReservations = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const catway = await Catway.findOne({ catwayNumber });

    if (!catway) {
      return res.status(404).json({ message: `Catway ${catwayNumber} introuvable` });
    }

    const reservations = await reservationService.getByCatway(catwayNumber);
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
  }
};

// 🔹 Récupérer une réservation spécifique d’un catway
exports.getReservationById = async (req, res) => {
  try {
    const { id: catwayNumber, idReservation } = req.params;

    const reservation = await reservationService.getById(idReservation);
    if (!reservation || reservation.catwayNumber !== parseInt(catwayNumber)) {
      return res.status(404).json({ message: "Réservation introuvable pour ce catway" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Créer une nouvelle réservation pour un catway
exports.addReservation = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const { clientName, boatName, startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: "Dates invalides" });
    }

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      return res.status(404).json({ message: `Catway ${catwayNumber} inexistant` });
    }

    const conflict = await reservationService.findConflicts(catwayNumber, start, end);
    if (conflict) {
      return res.status(409).json({ message: "Conflit : ce catway est déjà réservé sur cette période" });
    }

    const reservation = await reservationService.add({
      catwayNumber,
      clientName,
      boatName,
      startDate: start,
      endDate: end
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la réservation" });
  }
};

// 🔹 Mettre à jour une réservation d’un catway
exports.updateReservation = async (req, res) => {
  try {
    const { id: catwayNumber, idReservation } = req.params;
    const { clientName, boatName, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: "Dates invalides" });
    }

    const reservation = await reservationService.getById(idReservation);
    if (!reservation || reservation.catwayNumber !== parseInt(catwayNumber)) {
      return res.status(404).json({ message: "Réservation introuvable pour ce catway" });
    }

    const conflict = await reservationService.findConflicts(catwayNumber, start, end, idReservation);
    if (conflict) {
      return res.status(409).json({ message: "Conflit : ce catway est déjà réservé sur cette période" });
    }

    const updated = await reservationService.update(idReservation, {
      clientName,
      boatName,
      startDate: start,
      endDate: end
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// 🔹 Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id: catwayNumber, idReservation } = req.params;

    const reservation = await reservationService.getById(idReservation);
    if (!reservation || reservation.catwayNumber !== parseInt(catwayNumber)) {
      return res.status(404).json({ message: "Réservation introuvable pour ce catway" });
    }

    await reservationService.delete(idReservation);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
