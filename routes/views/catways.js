const express = require('express');
const router = express.Router();
const Catway = require('../../models/catway');
const checkJWT = require('../../middlewares/checkJWT');

router.get('/', checkJWT, async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('catways', { catways, user: req.user, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

router.post('/add', checkJWT, async (req, res) => {
  let { catwayNumber, catwayType, catwayState } = req.body;
  
  catwayNumber = parseInt(catwayNumber, 10);

  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });

    if (isNaN(catwayNumber) || catwayNumber <= 0) {
      return res.render('catways', { catways, user: req.user, error: 'Le numéro doit être un entier positif' });
    }

    const exists = await Catway.findOne({ catwayNumber });
    if (exists) {
      return res.render('catways', { catways, user: req.user, error: 'Numéro déjà utilisé' });
    }

    const newCatway = new Catway({
      catwayNumber,
      catwayType,
      catwayState
    });

    await newCatway.save();
    res.redirect('/catways');
  } catch (error) {
    console.error(error);
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('catways', { catways, user: req.user, error: 'Erreur lors de l\'ajout du catway' });
  }
});

router.post('/update/:id', checkJWT, async (req, res) => {
  const { catwayState } = req.body;

  try {
    await Catway.findByIdAndUpdate(req.params.id, { catwayState });
    res.redirect('/catways');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la modification de l\'état');
  }
});

router.post('/delete/:id', checkJWT, async (req, res) => {
  try {
    await Catway.findByIdAndDelete(req.params.id);
    res.redirect('/catways');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la suppression du catway');
  }
});

module.exports = router;