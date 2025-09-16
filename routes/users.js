const express = require('express');
const router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');

// Route pour se connecter
router.post('/login', service.login);
// Route pour se déconnecter
router.get('/logout', service.logout);

router.get('/', service.getAllUsers);
router.post('/', service.add);

router.get('/:email', private.checkJWT, service.getByEmail);
router.put('/:email', private.checkJWT, service.update);
router.delete('/:email', private.checkJWT, service.delete);

module.exports = router;
