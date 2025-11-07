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

// GET /catways/:id → id représente le catwayNumber
exports.getCatwayById = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);
    const catway = await catwayService.getCatwayByNumber(catwayNumber);
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
    const catwayNumber = parseInt(req.params.id, 10);
    const { catwayState } = req.body;

    if (!catwayState) {
      return res.status(400).json({ message: "Le champ 'catwayState' est requis pour la mise à jour" });
    }

    const updatedCatway = await catwayService.updateCatway(catwayNumber, catwayState);
    if (!updatedCatway) {
      return res.status(404).json({ message: "Catway non trouvé" });
    }

    res.status(200).json(updatedCatway);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Erreur lors de la mise à jour" });
  }
};

exports.deleteCatway = async (req, res) => {
  const catwayNumber = parseInt(req.params.id, 10);
  try {
    const deleted = await catwayService.deleteCatway(catwayNumber);
    if (!deleted) return res.status(404).json({ message: "Catway non trouvé" });

    res.status(200).json({ message: `Catway ${catwayNumber} supprimé avec succès` });
  } catch (error) {
    res.status(400).json({ message: error.message || "Erreur lors de la suppression" });
  }
};