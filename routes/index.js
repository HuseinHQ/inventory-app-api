const express = require('express');
const router = express();

const UserController = require('../controllers/UserController');

const itemRoutes = require('./items');
const logRoutes = require('./logs');
const authentication = require('../middlewares/authentication');
const ItemController = require('../controllers/ItemController');

// Login and Register
router.post('/login', UserController.login);
router.post('/register', UserController.register);

// Routes bellow need authentication
router.use(authentication);
router.get('/user', UserController.getUserDetail);
router.use('/items', itemRoutes);
router.use('/logs', logRoutes);
router.get('/categories', ItemController.getCategories);

module.exports = router;
