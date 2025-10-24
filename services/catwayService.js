const Catway = require('../models/catway');

exports.getAllCatways = async () => {
  return await Catway.find().sort({ catwayNumber: 1 });
};


exports.getCatwayById = async (id) => Catway.findById(id);

// ⚠️ Ajouter un catway
// Ton code est bon, mais pour l’AJAX on veut renvoyer une erreur claire (objet Error)
exports.addCatway = async ({ catwayNumber, catwayType, catwayState }) => {
  const exists = await Catway.findOne({ catwayNumber });
  if (exists) throw new Error("Ce numéro de catway est déjà utilisé.");

  const catway = new Catway({
    catwayNumber,
    catwayType,
    catwayState
  });

  return await catway.save();
};

exports.updateCatway = async (id, catwayState) => {
  const catway = await Catway.findById(id);
  if (!catway) throw new Error("Catway introuvable");
  
  catway.catwayState = catwayState;
  return catway.save();
};

exports.deleteCatway = async (id) => {
  const deleted = await Catway.findByIdAndDelete(id);
  if (!deleted) throw new Error("Catway introuvable");
  return deleted;
};
