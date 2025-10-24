const express = require('express');
const router = express.Router({ mergeParams: true }); 
const private = require('../../middlewares/checkJWT');
const reservationController = require('../../controllers/reservationController');

router.get('/', private, reservationController.getAllReservations);
router.post('/', private, reservationController.addReservation);

router.get('/:idReservation', private, reservationController.getReservationById);
router.put('/:idReservation', private, reservationController.updateReservation);
router.delete('/:idReservation', private, reservationController.deleteReservation);

module.exports = router;