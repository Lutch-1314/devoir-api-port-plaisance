const catwayService = require('../services/catwayService');

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.json(catways);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getCatwayById = async (req, res) => {
  try {
    const catway = await catwayService.getCatwayById(req.params.id);
    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
    res.json(catway);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.addCatway = async (req, res) => {
  try {
    const catway = await catwayService.addCatway(req.body);
    res.status(201).json(catway);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateCatway = async (req, res) => {
  try {
    const catway = await catwayService.updateCatway(req.params.id, req.body.catwayState);
    res.json(catway);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCatway = async (req, res) => {
  try {
    await catwayService.deleteCatway(req.params.id);
    res.sendStatus(204); // No Content
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
