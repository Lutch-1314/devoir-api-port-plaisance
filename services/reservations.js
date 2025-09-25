const Reservation = require('../models/reservation');

exports.getById = async (req, res, next) => {

    try {
        let reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayNumber: parseInt(req.params.id) // on vérifie aussi le numéro de catway
        });

        if (reservation) {
            return res.status(200).json(reservation);
        }

        return res.status(404).json({ message: 'Réservation introuvable' });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

exports.getAllByCatway = async (req, res, next) => {
    try {
        let reservations = await Reservation.find({ catwayNumber: parseInt(req.params.id) });
        return res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};
    
exports.add = async (req, res, next) => { 
  try {
    const catwayNumber = parseInt(req.params.id);
    const { clientName, boatName, startDate: s, endDate: e } = req.body;

    // Conversion et validation des dates
    const start = new Date(s);
    const end = new Date(e);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Dates invalides' });
    }

    if (start >= end) {
      return res.status(400).json({ message: 'La date de début doit être avant la date de fin' });
    }

    // DEBUG (tu peux retirer après test)
    console.log('ADD reservation ->', { catwayNumber, start, end });

    // Vérifier conflit (chevauchement inclus)
    const conflicts = await Reservation.find({ catwayNumber });

    const overlap = conflicts.some(r => {
      const existingStart = new Date(r.startDate).getTime();
      const existingEnd = new Date(r.endDate).getTime();
      const newStart = start.getTime();
      const newEnd = end.getTime();

      // vraie détection de chevauchement
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (overlap) {
      return res.status(409).json({ message: 'Conflit : ce catway est déjà réservé sur cette période' });
    }

    // Création de la réservation
    const reservation = await Reservation.create({
      catwayNumber,
      clientName,
      boatName,
      startDate: start,
      endDate: end
    });

    return res.status(201).json(reservation);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.update = async (req, res, next) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const reservationId = req.params.idReservation;
    const { clientName, boatName, startDate: s, endDate: e } = req.body;

    // Conversion et validation des dates
    const start = new Date(s);
    const end = new Date(e);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Dates invalides' });
    }

    if (start >= end) {
      return res.status(400).json({ message: 'La date de début doit être avant la date de fin' });
    }

    // Vérifier que la réservation existe
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    // Vérifier conflit avec les autres réservations du même catway
    const conflicts = await Reservation.find({ 
      catwayNumber, 
      _id: { $ne: reservationId } // exclure la réservation en cours de modification
    });

    const overlap = conflicts.some(r => {
      const existingStart = new Date(r.startDate).getTime();
      const existingEnd = new Date(r.endDate).getTime();
      const newStart = start.getTime();
      const newEnd = end.getTime();

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (overlap) {
      return res.status(409).json({ message: 'Conflit : ce catway est déjà réservé sur cette période' });
    }

    // Mise à jour des champs
    reservation.catwayNumber = catwayNumber;
    reservation.clientName = clientName;
    reservation.boatName = boatName;
    reservation.startDate = start;
    reservation.endDate = end;

    await reservation.save();

    return res.status(200).json(reservation);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.delete = async (req, res, next) => {

    try {
        const result = await Reservation.deleteOne({ _id: req.params.idReservation });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Réservation introuvable' });
        }

        return res.sendStatus(204);

    } catch (error) {
        console.error(error); // permet de voir l'erreur côté serveur
        return res.status(500).json({ message: 'Erreur serveur', error: error });
    }
};