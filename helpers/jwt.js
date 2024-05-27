const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const createToken = (payload) => jwt.sign(payload, SECRET_KEY);
const verifytoken = (token) => jwt.verify(token, SECRET_KEY);

module.exports = {
  createToken,
  verifytoken,
};
