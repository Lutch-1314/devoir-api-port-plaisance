const express = require('express');
const router = express.Router();
const service = require('../../services/catways');
const private = require('../../middlewares/private');

router.get('/', private.checkJWT, service.getAllCatways);
router.post('/', private.checkJWT, service.add);

router.get('/:id', private.checkJWT, service.getById);
router.put('/:id', private.checkJWT, service.update);
router.delete('/:id', private.checkJWT, service.delete);

module.exports = router;