const express = require('express');
const router = express.Router();
const Reservation = require('../../models/reservation');
const Catway = require('../../models/catway');
const private = require('../../middlewares/checkJWT');

router.get('/', private, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ startDate: 1 });
    const catways = await Catway.find().sort({ catwayNumber: 1 });

    const today = new Date();

    // Séparer selon la date
    const pastReservations = reservations.filter(r => new Date(r.endDate) < today);
    const currentReservations = reservations.filter(r => new Date(r.startDate) <= today && new Date(r.endDate) >= today);
    const futureReservations = reservations.filter(r => new Date(r.startDate) > today);

    res.render('reservations', {
      pastReservations,
      currentReservations,
      futureReservations,
      catways,
      user: req.user,
      error: null
    });
  } catch (err) {
    console.error('GET /reservations error:', err);
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


router.post('/add', private, async (req, res) => {
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

router.post('/update/:id', private, async (req, res) => {
  try {
    let { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

    catwayNumber = parseInt(catwayNumber, 10);
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vérifications de base
    if (isNaN(catwayNumber) || isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      throw new Error('Les données fournies sont invalides.');
    }

    // Vérifie si le catway existe
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) throw new Error(`Le catway ${catwayNumber} n'existe pas.`);

    // Vérifie les chevauchements
    const overlapping = await Reservation.findOne({
      _id: { $ne: req.params.id },
      catwayNumber: catway.catwayNumber,
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (overlapping) throw new Error(`Le catway ${catwayNumber} est déjà réservé pendant cette période.`);

    // Mise à jour
    await Reservation.findByIdAndUpdate(req.params.id, {
      catwayNumber,
      clientName,
      boatName,
      startDate: start,
      endDate: end
    });

    return res.redirect('/reservations');

  } catch (err) {
    console.error('Erreur de mise à jour réservation :', err.message);

    // ⚠️ On recharge toutes les données pour re-render la page proprement
    const allReservations = await Reservation.find().sort({ startDate: 1 });
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    const now = new Date();

    const currentReservations = allReservations.filter(r => r.startDate <= now && r.endDate >= now);
    const futureReservations = allReservations.filter(r => r.startDate > now);
    const pastReservations = allReservations.filter(r => r.endDate < now);

    return res.render('reservations', {
      user: req.user,
      currentReservations,
      futureReservations,
      pastReservations,
      catways,
      error: err.message
    });
  }
});


router.post('/delete/:id', private, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la suppression de la réservation');
  }
});

module.exports = router;