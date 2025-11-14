const Reservation = require('../models/reservation');

exports.getAll = async () => {
  return Reservation.find().sort({ startDate: 1 });
};

exports.getByCatway = async (catwayNumber) => {
  return Reservation.find({ catwayNumber }).sort({ startDate: 1 });
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

  if (data.catwayNumber !== undefined) {
    reservation.catwayNumber = parseInt(data.catwayNumber, 10);
  }

  if (data.clientName !== undefined) reservation.clientName = data.clientName;
  if (data.boatName !== undefined) reservation.boatName = data.boatName;
  if (data.startDate !== undefined) reservation.startDate = data.startDate;
  if (data.endDate !== undefined) reservation.endDate = data.endDate;

  return reservation.save();
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