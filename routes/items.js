const express = require('express');
const ItemController = require('../controllers/ItemController.js');
const { isItemYours } = require('../middlewares/authorization.js');
const multerMiddleware = require('../middlewares/multer.js');
const multer = require('multer');
const upload = multer();

const router = express();

router.get('/', ItemController.getItems);
router.post('/', multerMiddleware, ItemController.postItems);
router.get('/favorite', ItemController.getFavoriteItems);
router.get('/:id', isItemYours, ItemController.getItemDetail);
router.put('/:id', isItemYours, ItemController.putItem);
router.delete('/:id', isItemYours, ItemController.deleteItem);
router.post('/:id/image', isItemYours, upload.single('image'), ItemController.postImage);
router.patch('/:id/favorite', isItemYours, ItemController.patchFavorite);

module.exports = router;
