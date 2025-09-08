const express = require('express');
const router = express.Router();

const service = require('../services/users');

router.put('/add', service.add);

router.get('/users', service.users);

router.patch('/:id', service.update);

router.delete('/:id', service.delete);

module.exports = router;
