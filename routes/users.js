const express = require('express');
const router = express.Router();

const service = require('../services/users');
router.get('/', service.getAllUsers);
router.get('/:email', service.getByEmail);
router.post('/', service.add);
router.put('/:email', service.update);
router.delete('/:email', service.delete);

// Route pour se connecter
router.post('/login', service.login);

module.exports = router;
