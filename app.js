const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ Connecté à MongoDB : ${process.env.MONGO_URI}`))
  .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // log serveur
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur',
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
