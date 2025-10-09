const userService = require('../services/userService');

exports.showUsersPage = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.render('users', { Users: users, editable: true, error: null });
  } catch (err) {
    res.render('users', { Users: [], editable: true, error: "Erreur lors du chargement des utilisateurs." });
  }
};
