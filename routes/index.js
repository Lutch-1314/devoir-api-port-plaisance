const express = require('express');
const router = express.Router();

const homeRouter = require('./views/home');
const authRouter = require('./views/auth');
const catwaysViewRouter = require('./views/catways');
const dashboardRouter = require('./views/dashboard');

const usersRouter = require('./api/users');
const catwaysRouter = require('./api/catways');
const reservationsRouter = require('./api/reservations');

router.use('/', homeRouter);
router.use('/', authRouter);
router.use('/dashboard', dashboardRouter);
router.use('/catways', catwaysViewRouter);

router.use('/api/users', usersRouter);
router.use('/api/catways', catwaysRouter);
router.use('/api/catways/:id/reservations', reservationsRouter);

module.exports = router;