const Catway = require('../models/catway');

exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let catway = await Catway.findOne({ catwayNumber: parseInt(id) });

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json('catway_not_found');
    } catch (error) {
        return res.status(500).json(error);
    }
}

exports.getAllCatways = async (req, res, next) => {
    try {
        let catways = await Catway.find({}, 'catwayNumber catwayType catwayState');
        return res.status(200).json(catways);
    } catch (error) {
        return res.status(500).json(error);
    }
};
    
exports.add = async (req, res, next) => {

    const temp = ({
        catwayNumber : req.body.catwayNumber,
        catwayType : req.body.catwayType,
        catwayState : req.body.catwayState
    });

    try {
        let catway = await Catway.create(temp);

        return res.status(201).json(catway);
    } catch (error) {
        return res.status(500).json(error);
    }
}

exports.update = async (req, res) => {
  const { id } = req.params;
  const { catwayNumber, catwayType, catwayState } = req.body;

  try {
    const catway = await Catway.findById(id);

    if (!catway) {
      return res.status(404).json({ message: "Catway non trouvé" });
    }

    if (catwayNumber || catwayType) {
      return res.status(400).json({ message: "Seul l'état peut être modifié" });
    }

    if (catwayState) {
      catway.catwayState = catwayState;
      await catway.save();
    }

    return res.status(200).json(catway);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.delete = async (req, res, next) => {
    const id = req.params.id;

    try {
        const result = await Catway.deleteOne({ catwayNumber: parseInt(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'catway_not_found' });
        }

        return res.sendStatus(204);

    } catch (error) {
        console.error(error); // permet de voir l'erreur côté serveur
        return res.status(500).json({ message: 'server_error', error: error });
    }
};
