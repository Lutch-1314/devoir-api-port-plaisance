const express = require('express');
const router = express.Router();
const private = require('../../middlewares/checkJWT');
const userService = require('../../services/userService');

router.get('/', private, async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.render('users', {
      users,
      user: req.user,
      message: req.query.message,
      messageType: req.query.messageType,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('users', {
      users: [],
      user: req.user,
      message: null,
      messageType: null,
      error: "Impossible de charger les utilisateurs"
    });
  }
});

module.exports = router;