const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.getByEmail = async (req, res, next) => {
    const email = req.params.email

    try {
        let user = await User.findOne({ email : email });

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(500).json(error);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        let users = await User.find({}, 'username');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
};
    
exports.add = async (req, res, next) => {

    const temp = ({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

exports.update = async (req, res, next) => {
    const email = req.params.email
    const temp = ({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.findOne({ email : email });

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save();
            return res.status(201).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(500).json(error);
    }
}

exports.delete = async (req, res, next) => {
    const email = req.params.email

    try {
        await User.deleteOne({ email: email });

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json(error);
    }
}

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