const express = require('express');
const ItemController = require('../controllers/ItemController.js');
const { isItemYours } = require('../middlewares/authorization.js');
const multerMiddleware = require('../helpers/multerConfig.js');

const router = express();

router.get('/', ItemController.getItems);
router.post('/', multerMiddleware, ItemController.postItems);
router.get('/favorite', ItemController.getFavoriteItems);
router.get('/:id', isItemYours, ItemController.getItemDetail);
router.put('/:id', multerMiddleware, isItemYours, ItemController.putItem);
router.delete('/:id', isItemYours, ItemController.deleteItem);
router.patch('/:id/favorite', isItemYours, ItemController.patchFavorite);

module.exports = router;
