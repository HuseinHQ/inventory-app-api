const express = require('express');
const router = express();

const UserController = require('../controllers/UserController');

const itemRoutes = require('./items');
const logRoutes = require('./logs');
const authentication = require('../middlewares/authentication');

// Login and Register
router.post('/login', UserController.login);
router.post('/register', UserController.register);

// Routes bellow need authentication
router.use(authentication);
router.use('/items', itemRoutes);
router.use('/logs', logRoutes);

module.exports = router;
