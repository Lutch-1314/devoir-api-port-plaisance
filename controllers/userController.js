const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

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
    const user = await userService.updateUser(req.params.email, req.body);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur modification utilisateur", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.email);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression utilisateur", error: err.message });
  }
};
