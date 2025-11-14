// createUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // adapte le chemin si nécessaire

async function createUser() {
  try {
    // Connexion à MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const email = "val@gmail.com";        // ton email
    const username = "Val";               // ton username
    const password = "Val123&&&";         // mot de passe en clair

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    console.log('✅ User créé avec succès !');
    console.log(user);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err);
    process.exit(1);
  }
}

createUser();
