const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

const createToken = (payload) => jwt.sign(payload, JWT_SECRET_KEY);
const verifytoken = (token) => jwt.verify(token, JWT_SECRET_KEY);

module.exports = {
  createToken,
  verifytoken,
};
