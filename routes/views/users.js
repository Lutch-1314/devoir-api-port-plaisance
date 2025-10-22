const express = require('express');
const router = express.Router();
const private = require('../../middlewares/checkJWT');
const userViewController = require('../../controllers/userViewController')
const userController = require('../../controllers/userController')

router.get('/', private, userViewController.showUsersPage);

router.post('/update/:email', private, userController.updateUser);

// Route spécifique pour suppression via formulaire (POST)
router.post('/delete/:email', private, userController.deleteUser);

module.exports = router;