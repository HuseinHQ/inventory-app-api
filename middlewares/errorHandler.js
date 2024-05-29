function errorHandler(err, req, res, next) {
  console.error(`[errorHandler.js]: ${JSON.stringify(err)}`);

  let status = 500;
  let success = false;
  let message = 'Internal Server Error';

  if (err.name === 'null_input') {
    status = 400;
    message = err.data.message;
  } else if (err.name === 'invalid_auth') {
    status = 401;
    message = 'Invalid Username/Password';
  } else if (err.name === 'password_not_match') {
    status = 400;
    message = 'Password confirmation not match';
  } else if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = err.errors[0].message;
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = err.errors[0].message;
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  } else if (err.name === 'SequelizeConnectionRefusedError') {
    status = 503;
    message = 'Service Unavailable';
  } else if (err.name === 'not_found') {
    status = 404;
    message = 'Error not found';
  } else if (err.name === 'forbidden') {
    status = 403;
    message = 'You are not authorized to do this';
  }

  res.status(status).json({ success, status, message });
}

module.exports = errorHandler;
