const express = require('express');
const router = express.Router({ mergeParams: true }); 
const reservationService = require('../../services/reservations');
const private = require('../../middlewares/checkJWT');

router.get('/', private, reservationService.getAllByCatway);
router.post('/', private, reservationService.add);

router.get('/:idReservation', private, reservationService.getById);
router.put('/:idReservation', private, reservationService.update);
router.delete('/:idReservation', private, reservationService.delete);

module.exports = router;