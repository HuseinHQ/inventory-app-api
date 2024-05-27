const express = require('express');
const router = express();

const ItemController = require('../controllers/ItemController.js');

router.get('/', ItemController.getItems);
router.post('/', ItemController.postItems);

module.exports = router;
