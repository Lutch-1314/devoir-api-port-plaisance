// services/userService.js
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Récupère tous les utilisateurs, sans le mot de passe
exports.getAllUsers = async () => {
  return User.find({}, { password: 0 }).sort({ email: 1 });
};

// Récupère un utilisateur par son email
exports.getUserByEmail = async (email) => {
  return User.findOne({ email });
};

// Ajoute un nouvel utilisateur avec mot de passe hashé
exports.addUser = async (data) => {
  if (!data.password) throw new Error("Le mot de passe est requis");
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashedPassword });
};

// Met à jour un utilisateur par email
exports.updateUser = async (email, data) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur introuvable");

  // Hash du mot de passe si modifié
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // Mise à jour uniquement des champs reçus
  Object.keys(data).forEach(key => {
    user[key] = data[key];
  });

  return user.save();
};

// Supprime un utilisateur par email
exports.deleteUser = async (email) => {
  const result = await User.deleteOne({ email });
  if (result.deletedCount === 0) throw new Error("Utilisateur introuvable");
  return result;
};