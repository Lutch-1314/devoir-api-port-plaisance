const express = require('express');
const router = express.Router();
const private = require('../../middlewares/checkJWT');
const catwayController = require('../../controllers/catwayController');

router.get('/', private, catwayController.getAllCatways);
router.post('/', private, catwayController.addCatway);

router.get('/:id', private, catwayController.getCatwayById);
router.put('/:id', private, catwayController.updateCatway);
router.delete('/:id', private, catwayController.deleteCatway);

module.exports = router;