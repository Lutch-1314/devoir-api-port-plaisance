const express = require('express');
const router = express.Router();

const service = require('../services/users');

router.get('/', service.getAllUsers);

router.get('/:email', service.getByEmail);

router.post('/', service.add);

router.put('/:email', service.update);

router.delete('/:email', service.delete);

module.exports = router;
