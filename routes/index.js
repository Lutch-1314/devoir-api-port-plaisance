const express = require('express');
const router = express.Router();

const userRoute = require('../routes/users');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('home'); // Express va chercher views/home.ejs
});

router.use('/users', userRoute);

module.exports = router;
