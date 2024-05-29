const express = require('express');
const router = express();
const multer = require('multer');
const upload = multer();

const ItemController = require('../controllers/ItemController.js');
const { isItemYours } = require('../middlewares/authorization.js');

router.get('/', ItemController.getItems);
router.post('/', ItemController.postItems);
router.get('/favorite', ItemController.getFavoriteItems);
router.get('/:id', isItemYours, ItemController.getItemDetail);
router.delete('/:id', isItemYours, ItemController.deleteItem);
router.patch('/:id/favorite', isItemYours, ItemController.patchFavorite);
// router.patch('/:id/image', ItemController)

module.exports = router;
