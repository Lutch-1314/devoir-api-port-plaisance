// controllers/catwayController.js
const catwayService = require('../services/catwayService');

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.status(200).json(catways);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors du chargement des catways" });
  }
};

exports.getCatwayById = async (req, res) => {
  try {
    const catway = await catwayService.getCatwayById(req.params.idCatway);
    if (!catway) return res.status(404).json({ message: "Catway introuvable" });
    res.status(200).json(catway);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.addCatway = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    const newCatway = await catwayService.addCatway({ catwayNumber, catwayType, catwayState });
    res.status(201).json(newCatway);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Erreur lors de l'ajout du catway" });
  }
};

exports.updateCatway = async (req, res) => {
  try {
    const { catwayState } = req.body;
    const catwayNumber = parseInt(req.params.id, 10);
    const updated = await catwayService.updateCatway(catwayNumber, catwayState);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Erreur lors de la mise à jour" });
  }
};

exports.deleteCatway = async (req, res) => {
  const catwayNumber = parseInt(req.params.id, 10);
  try {
    await catwayService.deleteCatway(catwayNumber); // le service supprime le catway par numéro
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message || "Erreur lors de la suppression" });
  }
};

