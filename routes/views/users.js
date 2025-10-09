const express = require('express');
const router = express.Router();
const private = require('../../middlewares/checkJWT');
const userViewController = require('../../controllers/userViewController')

router.get('/', private, userViewController.showUsersPage);

module.exports = router;