const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const private = require('../../middlewares/checkJWT');

router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/', private, userController.getAllUsers);
router.post('/', private, userController.addUser);

router.get('/:email', private, userController.getUserByEmail);
router.put('/:email', private, userController.updateUser);
router.delete('/:email', private, userController.deleteUser);

module.exports = router;