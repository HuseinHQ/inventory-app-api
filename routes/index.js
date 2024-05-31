const express = require('express');
const router = express();
const path = require('path');

const UserController = require('../controllers/UserController');

const itemRoutes = require('./items');
const logRoutes = require('./logs');
const authentication = require('../middlewares/authentication');
const ItemController = require('../controllers/ItemController');

// Login and Register
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/uploads/images/:image', (req, res) => {
  const imageName = req.params.image;
  console.log(path.join(__dirname, '..', 'uploads', 'images', imageName));
  res.status(200).sendFile(path.join(__dirname, '..', 'uploads', 'images', imageName));
});

// Routes bellow need authentication
router.use(authentication);
router.get('/user', UserController.getUserDetail);
router.use('/items', itemRoutes);
router.use('/logs', logRoutes);
router.get('/categories', ItemController.getCategories);

module.exports = router;
