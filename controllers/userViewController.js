const userService = require('../services/userService');

exports.showUsersPage = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.render('users', {
      users,
      message: req.query.message || '',
      messageType: req.query.messageType || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('users', {
      users: [],
      message: 'Erreur lors du chargement des utilisateurs',
      messageType: 'error'
    });
  }
};