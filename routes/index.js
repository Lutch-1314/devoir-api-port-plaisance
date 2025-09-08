const express = require('express');
const router = express.Router();

const userRoute = require('../routes/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Bienvenue dans mon API 🚀' });
});

router.use('/users', userRoute);

module.exports = router;
