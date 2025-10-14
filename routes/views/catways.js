const express = require('express');
const router = express.Router();
const Catway = require('../../models/catway');
const private = require('../../middlewares/checkJWT');

// 📘 Page principale des catways
router.get('/', private, async (req, res) => {
  const catways = await Catway.find().sort({ catwayNumber: 1 });

  res.render('catways', {
    catways,
    user: req.user,
    message: req.query.message,
    messageType: req.query.messageType
  });
});

// ➕ Ajout d’un catway
router.post('/add', private, async (req, res) => {
  let { catwayNumber, catwayType, catwayState } = req.body;
  catwayNumber = parseInt(catwayNumber, 10);

  try {
    if (isNaN(catwayNumber) || catwayNumber <= 0) {
      return res.redirect('/catways?message=Le numéro doit être un entier positif&messageType=error');
    }

    const exists = await Catway.findOne({ catwayNumber });
    if (exists) {
      return res.redirect('/catways?message=Numéro déjà utilisé&messageType=error');
    }

    const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
    await newCatway.save();

    res.redirect('/catways?message=Catway ajouté avec succès&messageType=success');

  } catch (error) {
    console.error(error);
    res.redirect('/catways?message=Erreur lors de l\'ajout du catway&messageType=error');
  }
});


// ✏️ Mise à jour de l’état
router.post('/update/:id', private, async (req, res) => {
  const { catwayState } = req.body;

  try {
    await Catway.findByIdAndUpdate(req.params.id, { catwayState });
    res.redirect(`/catways?message=Catway modifié avec succès&messageType=success`);
  } catch (err) {
    console.error(err);
    res.redirect(`/catways?message=Erreur lors de la modification&messageType=error`);
  }
});

// ❌ Suppression d’un catway
router.post('/delete/:id', private, async (req, res) => {
  try {
    await Catway.findByIdAndDelete(req.params.id);
    res.redirect(`/catways?message=Catway supprimé avec succès&messageType=success`);
  } catch (err) {
    console.error(err);
    res.redirect(`/catways?message=Erreur lors de la suppression&messageType=error`);
  }
});

module.exports = router;
