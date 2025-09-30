const express = require('express');
const router = express.Router();
const Catway = require('../../models/catway');
const checkJWT = require('../../middlewares/checkJWT');

router.get('/', checkJWT, async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('catways', { catways, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;