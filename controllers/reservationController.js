// controllers/reservationController.js
const reservationService = require('../services/reservationService');
const Catway = require('../models/catway');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAll();
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await reservationService.getById(req.params.idReservation);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.addReservation = async (req, res) => {
  try {
    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 🔍 Validation des dates
    if (isNaN(start) || isNaN(end) || start >= end) {
      const message = "Dates invalides";
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect(`/reservations?message=${encodeURIComponent(message)}&messageType=error`);
      }
      return res.status(400).json({ message });
    }

    // 🔍 Vérifie que le catway existe
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      const message = `Catway ${catwayNumber} inexistant`;
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect(`/reservations?message=${encodeURIComponent(message)}&messageType=error`);
      }
      return res.status(404).json({ message });
    }

    // 🔍 Vérifie s’il y a un conflit de réservation
    const conflict = await reservationService.findConflicts(catwayNumber, start, end);
    if (conflict) {
      const message = "Conflit : ce catway est déjà réservé sur cette période";
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect(`/reservations?message=${encodeURIComponent(message)}&messageType=error`);
      }
      return res.status(409).json({ message });
    }

    // ✅ Ajoute la réservation
    const reservation = await reservationService.add({
      catwayNumber,
      clientName,
      boatName,
      startDate: start,
      endDate: end
    });

    // 🧭 Si c’est une requête HTML (formulaire classique), on redirige
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/reservations?message=Réservation créée avec succès&messageType=success");
    }

    // 🧩 Sinon, on renvoie le JSON (pour API ou AJAX)
    res.status(201).json(reservation);

  } catch (error) {
    console.error(error);
    const message = "Erreur lors de la création de la réservation";
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect(`/reservations?message=${encodeURIComponent(message)}&messageType=error`);
    }
    res.status(500).json({ message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.idReservation;
    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: "Dates invalides" });
    }

    const reservation = await reservationService.getById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    const conflict = await reservationService.findConflicts(catwayNumber, start, end, reservationId);
    if (conflict) {
      return res.status(409).json({ message: "Conflit : ce catway est déjà réservé sur cette période" });
    }

    const updated = await reservationService.update(reservationId, {
      catwayNumber,
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



exports.deleteReservation = async (req, res) => {
  try {
    await reservationService.delete(req.params.idReservation);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
