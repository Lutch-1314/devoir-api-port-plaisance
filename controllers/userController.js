const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ message: "Mot de passe incorrect" });

    const payload = { username: user.username, email: user.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });

    res.cookie('token', token, { httpOnly: true, maxAge: 24*60*60*1000 });
    res.status(200).json({ message: "Connexion réussie", user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Impossible de charger les utilisateurs", error: err.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const user = await userService.addUser(req.body);
    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Erreur lors de l'ajout" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    const targetEmail = req.params.email;

    const updatedUser = await userService.updateUser(targetEmail, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Ne plus faire de redirection, renvoyer JSON
    res.status(200).json({
      username: updatedUser.username,
      email: updatedUser.email
    });
  } catch (err) {
    console.error("🔥 Erreur modification utilisateur:", err);
    res.status(400).json({ message: "Erreur modification utilisateur" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    await userService.deleteUser(email);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Erreur lors de la suppression" });
  }
};