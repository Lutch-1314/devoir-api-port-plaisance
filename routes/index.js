var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Bienvenue dans mon API 🚀' });
});

module.exports = router;
