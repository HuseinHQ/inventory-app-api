const express = require('express');
const router = express();
const multer = require('multer');
const upload = multer();

const ItemController = require('../controllers/ItemController.js');

router.get('/', ItemController.getItems);
router.post('/', ItemController.postItems);
router.get('/:id', ItemController.getItemByPk);
// router.patch('/:id/image', ItemController)

module.exports = router;
