const express = require('express');
const router = express.Router();
const service = require('../../services/catways');
const private = require('../../middlewares/checkJWT');

router.get('/', private, service.getAllCatways);
router.post('/', private, service.add);

router.get('/:id', private, service.getById);
router.put('/:id', private, service.update);
router.delete('/:id', private, service.delete);

module.exports = router;