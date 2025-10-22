const User = require('../models/user');
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email });

        if (!user) return res.status(404).json('Utilisateur non trouvé');

        bcrypt.compare(password, user.password, function(err, response) {
            if (err) return next(err);

            if (!response) return res.status(403).json('Mot de passe incorrect');

            // On ne met que les infos utiles dans le JWT
            const payload = {
                username: user.username,
                email: user.email
            };

            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });

            // Stockage dans un cookie pour les vues
            res.cookie('token', token, { httpOnly: true, maxAge: 24*60*60*1000 });

            // Redirection vers le dashboard
            return res.redirect('/dashboard');
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        // Comme on ne peut pas invalider un JWT côté serveur,
        // on dit juste au client de le supprimer.
        return res.status(200).json({
            message: 'logout_succeed',
            info: 'Supprimez le token côté client pour finaliser la déconnexion'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const user = await userService.addUser(req.body);
    res.status(201).json({ message: "Utilisateur créé avec succès", user: user });
  } catch (err) {
    console.error("🔥 Erreur dans addUser :", err);
    res.status(500).json({ message: "Erreur ajout utilisateur", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Si le mot de passe est vide, on ne le met pas à jour
    if (!updates.password || updates.password.trim() === '') {
      delete updates.password;
    }

    const user = await userService.updateUser(req.params.email, updates);

    if (!user) {
      return res.redirect('/users?message=Utilisateur introuvable&messageType=error');
    }

    res.redirect('/users?message=Utilisateur mis à jour avec succès&messageType=success');
  } catch (err) {
    console.error("🔥 Erreur modification utilisateur:", err);
    res.redirect('/users?message=Erreur modification utilisateur&messageType=error');
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.redirect('/users?message=Email manquant&messageType=error');
    }

    const deletedUser = await User.findOneAndDelete({ email: email });
    if (!deletedUser) {
      return res.redirect('/users?message=Utilisateur non trouvé&messageType=error');
    }

    res.redirect('/users?message=Utilisateur supprimé avec succès&messageType=success');
  } catch (err) {
    console.error('🔥 Erreur lors de la suppression:', err);
    res.redirect('/users?message=Erreur lors de la suppression&messageType=error');
  }
};
