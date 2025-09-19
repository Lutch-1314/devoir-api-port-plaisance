require('dotenv').config({ path: './env/.env' }); // charge tes variables d'environnement
const mongoose = require('mongoose');
const Catway = require('../models/catway');
const fs = require('fs');
const path = require('path');

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur connexion MongoDB', err));

// Lecture du JSON
const dataPath = path.join(__dirname, '../data/catways.json');
const catways = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Import
const importData = async () => {
  try {
    await Catway.deleteMany(); // optionnel : vide la collection avant import
    await Catway.insertMany(catways);
    console.log('✅ Données catways importées');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur import', err);
    process.exit(1);
  }
};

importData();