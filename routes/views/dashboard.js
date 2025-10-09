const express = require('express');
const router = express.Router();
const Reservation = require('../../models/reservation');
const private = require('../../middlewares/checkJWT');

router.get('/', private, async (req, res) => {
  try {
    const user = req.user;
    console.log('user:', req.user); //test

    const reservations = await Reservation.find({
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    res.render('dashboard', { 
        user: req.user,
        currentDate: new Date().toLocaleDateString('fr-FR'),
        reservations
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;