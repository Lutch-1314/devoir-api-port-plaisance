const express = require('express');
const router = express.Router();
const Reservation = require('../../models/reservation');
const Catway = require('../../models/catway');
const checkJWT = require('../../middlewares/checkJWT');

router.get('/', checkJWT, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ startDate: 1 });
    const catways = await Catway.find().sort({ catwayNumber: 1 });

    res.render('reservations', {
      reservations,
      catways,
      user: req.user,
      error: null
    });
  } catch (err) {
    console.error('GET /reservations error:', err);
    res.render('reservations', {
      reservations: [],
      catways: [],
      user: req.user,
      error: "Impossible de charger les réservations"
    });
  }
});

router.post('/add', checkJWT, async (req, res) => {
  try {
    let { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

    catwayNumber = parseInt(catwayNumber, 10);
    if (isNaN(catwayNumber)) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      return res.render('reservations', {
        reservations,
        user: req.user,
        error: 'Le numéro de catway doit être un entier valide'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      return res.render('reservations', {
        reservations,
        user: req.user,
        error: 'Dates invalides'
      });
    }

    if (end < start) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      return res.render('reservations', {
        reservations,
        user: req.user,
        error: 'La date de fin doit être postérieure ou égale à la date de début'
      });
    }

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      return res.render('reservations', {
        reservations,
        user: req.user,
        error: `Le catway ${catwayNumber} n'existe pas`
      });
    }

    const overlapping = await Reservation.findOne({
      catwayNumber: catway.catwayNumber,
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (overlapping) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      return res.render('reservations', {
        reservations,
        user: req.user,
        error: `Le catway ${catwayNumber} est déjà réservé pendant cette période`
      });
    }

    const newReservation = new Reservation({
      catwayNumber: catway.catwayNumber,
      clientName,
      boatName,
      startDate: start,
      endDate: end
    });

    await newReservation.save();

    return res.redirect('/reservations');
  } catch (err) {
    // log complet pour debugger
    console.error('POST /reservations/add error:', err);
    const reservations = await Reservation.find().sort({ startDate: 1 });
    return res.render('reservations', {
      reservations,
      user: req.user,
      error: "Erreur lors de l'ajout de la réservation"
    });
  }
});

router.post('/update/:id', checkJWT, async (req, res) => {
  try {
    let { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

    catwayNumber = parseInt(catwayNumber, 10);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(catwayNumber)) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      const catways = await Catway.find().sort({ catwayNumber: 1 });
      return res.render('reservations', {
        reservations,
        catways,
        user: req.user,
        error: 'Le numéro de catway doit être un entier valide'
      });
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      const catways = await Catway.find().sort({ catwayNumber: 1 });
      return res.render('reservations', {
        reservations,
        catways,
        user: req.user,
        error: 'Dates invalides'
      });
    }

    if (end < start) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      const catways = await Catway.find().sort({ catwayNumber: 1 });
      return res.render('reservations', {
        reservations,
        catways,
        user: req.user,
        error: 'La date de fin doit être postérieure à la date de début'
      });
    }

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      const catways = await Catway.find().sort({ catwayNumber: 1 });
      return res.render('reservations', {
        reservations,
        catways,
        user: req.user,
        error: `Le catway ${catwayNumber} n'existe pas`
      });
    }

    // Vérifier qu’aucune autre réservation ne chevauche la période
    const overlapping = await Reservation.findOne({
      _id: { $ne: req.params.id }, // exclure la résa actuelle
      catwayNumber: catway.catwayNumber,
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (overlapping) {
      const reservations = await Reservation.find().sort({ startDate: 1 });
      const catways = await Catway.find().sort({ catwayNumber: 1 });
      return res.render('reservations', {
        reservations,
        catways,
        user: req.user,
        error: `Le catway ${catwayNumber} est déjà réservé pendant cette période`
      });
    }

    // Mise à jour
    await Reservation.findByIdAndUpdate(req.params.id, {
      catwayNumber: catway.catwayNumber,
      clientName,
      boatName,
      startDate: start,
      endDate: end
    });

    res.redirect('/reservations');
  } catch (err) {
    console.error('POST /reservations/update error:', err);
    const reservations = await Reservation.find().sort({ startDate: 1 });
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('reservations', {
      reservations,
      catways,
      user: req.user,
      error: "Erreur lors de la modification de la réservation"
    });
  }
});

router.post('/delete/:id', checkJWT, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la suppression de la réservation');
  }
});

module.exports = router;