const upload = require('../helpers/multerConfig');
const multer = require('multer');

function multerMiddleware(req, res, next) {
  try {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        throw { ...err, name: 'multer_error' };
      } else if (err) {
        // An unknown error occurred when uploading.
        throw { ...err, name: 'multer_error' };
      }

      // Everything went fine, pass to the next middleware
      next();
    });
  } catch (err) {
    next(err);
  }
}

module.exports = multerMiddleware;
