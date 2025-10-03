const express = require('express');
const router = express.Router();
const Reservation = require('../../models/reservation');
const checkJWT = require('../../middlewares/checkJWT');


// GET /reservations
router.get('/', checkJWT, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('catwayNumber');
    res.render('reservations', { 
      reservations, 
      user: req.user 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
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