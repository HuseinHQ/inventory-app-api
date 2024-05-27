const express = require('express');
const router = express();
const UserController = require('../controllers/UserController');

// Login and Register
router.post('/login', UserController.login);
router.post('/register', UserController.register);

module.exports = router;
