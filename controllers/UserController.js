const { comparePassword } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
const { User } = require('../models/index');

class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password, password_confirm } = req.body;
      if (!password_confirm) throw { name: 'null_input', data: { message: 'password_confirm is required' } };
      if (password !== password_confirm) throw { name: 'password_not_match' };

      await User.create({ name, email, password });

      res.status(201).json({ success: true, status: 201, message: 'New user created' });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: 'null_input', data: { message: 'Email is required' } };
      if (!password) throw { name: 'null_input', data: { message: 'Password is required' } };

      // Check if email is registered on database or not
      const findUser = await User.findOne({
        where: { email },
      });
      if (!findUser) throw { name: 'invalid_auth' };

      // Check if password is correct or not
      const isPasswordValid = comparePassword(password, findUser.dataValues.password);
      if (!isPasswordValid) throw { name: 'invalid_auth' };

      // Make a payload
      const payload = { id: findUser.dataValues.id };
      const access_token = createToken(payload);

      res.json({ success: true, status: 200, access_token });
    } catch (err) {
      next(err);
    }
  }

  static async getUserDetail(req, res, next) {
    try {
      const UserId = req.user.id;
      const findUser = await User.findByPk(UserId);
      if (!findUser) throw { name: 'not_found' };
      res.json({ success: true, status: 200, data: { name: findUser.name, email: findUser.email } });
    } catch (err) {
      next(err);
    }
  }

  static async getUserByPk(pk, next) {
    try {
      const findUser = await User.findByPk(pk);
      if (!findUser) throw { name: 'not_found' };
      return findUser;
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
