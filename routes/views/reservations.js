// routes/views/reservations.js
const express = require('express');
const router = express.Router();
const private = require('../../middlewares/checkJWT');
const reservationService = require('../../services/reservationService');
const Catway = require('../../models/catway');

router.get('/', private, async (req, res) => {
  try {
    const reservations = await reservationService.getAll();
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    const now = new Date();

    const pastReservations = reservations.filter(r => new Date(r.endDate) < now);
    const currentReservations = reservations.filter(r => new Date(r.startDate) <= now && new Date(r.endDate) >= now);
    const futureReservations = reservations.filter(r => new Date(r.startDate) > now);

    res.render('reservations', {
      pastReservations,
      currentReservations,
      futureReservations,
      catways,
      user: req.user,
      message: req.query.message,
      messageType: req.query.messageType,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('reservations', {
      pastReservations: [],
      currentReservations: [],
      futureReservations: [],
      catways: [],
      user: req.user,
      error: "Impossible de charger les réservations"
    });
  }
});

module.exports = router;