// routes/views/catways.js
const express = require('express');
const router = express.Router();
const private = require('../../middlewares/checkJWT');
const catwayService = require('../../services/catwayService');

router.get('/', private, async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();

    res.render('catways', {
      catways,
      user: req.user,
      message: req.query.message,
      messageType: req.query.messageType,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('catways', {
      catways: [],
      user: req.user,
      error: "Impossible de charger les catways",
      message: null,
      messageType: null
    });
  }
});

module.exports = router;
