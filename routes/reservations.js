const express = require('express');
const router = express.Router({ mergeParams: true }); 
const reservationService = require('../services/reservations');
const private = require('../middlewares/private');

router.get('/', private.checkJWT, reservationService.getAllByCatway);
router.post('/', private.checkJWT, reservationService.add);

router.get('/:idReservation', private.checkJWT, reservationService.getById);
router.put('/:idReservation', private.checkJWT, reservationService.update);
router.delete('/:idReservation', private.checkJWT, reservationService.delete);

module.exports = router;