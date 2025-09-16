const express = require('express');
const router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');

router.get('/', service.getAllUsers);
router.get('/:email', private.checkJWT, service.getByEmail);
router.post('/', service.add);
router.put('/:email', private.checkJWT, service.update);
router.delete('/:email', private.checkJWT, service.delete);

// Route pour se connecter
router.post('/login', service.login);

module.exports = router;
