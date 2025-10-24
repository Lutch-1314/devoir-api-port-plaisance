// services/reservationService.js
const Reservation = require('../models/reservation');

exports.getAll = async () => {
  return Reservation.find().sort({ startDate: 1 });
};

exports.getById = async (id) => {
  return Reservation.findById(id);
};

exports.add = async (data) => {
  return Reservation.create(data);
};

exports.update = async (id, data) => {
  const reservation = await Reservation.findById(id);
  if (!reservation) return null;

  // Assure-toi que catwayNumber est bien un nombre
  reservation.catwayNumber = parseInt(data.catwayNumber, 10);
  reservation.clientName = data.clientName;
  reservation.boatName = data.boatName;
  reservation.startDate = data.startDate;
  reservation.endDate = data.endDate;

  return reservation.save(); // 🔑 persistance en base
};

exports.delete = async (id) => {
  return Reservation.findByIdAndDelete(id);
};

exports.findConflicts = async (catwayNumber, start, end, excludeId = null) => {
  const query = {
    catwayNumber,
    startDate: { $lte: end },
    endDate: { $gte: start }
  };
  if (excludeId) query._id = { $ne: excludeId };
  return Reservation.findOne(query);
};
