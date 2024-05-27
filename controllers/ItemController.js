const { Item } = require('../models/index');
const { Op } = require('sequelize');
const LogController = require('./LogController');
const UserController = require('./UserController');
const formatDate = require('../helpers/formatDate');

class ItemController {
  static async getItems(req, res, next) {
    try {
      const UserId = req.user.id;
      const where = { UserId };
      let order = [];
      const { name, category, order_by, desc } = req.query;

      if (name) where.name = { [Op.iLike]: `%${name}%` };
      if (category) where.category = { [Op.like]: category };
      if (order_by) order.push([order_by, desc ? 'DESC' : 'ASC']);

      const findItems = await Item.findAll({
        where,
        order,
      });
      res.json({ success: true, status: 200, data: findItems });
    } catch (err) {
      next(err);
    }
  }

  static async getItemByPk(req, res, next) {
    try {
      const { id } = req.params;
      const findItem = await Item.findByPk(id);
      if (!findItem) throw { name: 'not_found' };
      res.json({ success: true, status: 200, data: findItem });
    } catch (err) {
      next(err);
    }
  }

  static async postItems(req, res, next) {
    try {
      const { name, description, quantity, category, location, condition } = req.body;
      const UserId = req.user.id;
      const { id: ItemId, createdAt } = await Item.create({
        UserId,
        name,
        description,
        quantity,
        category,
        location,
        condition,
      });

      const findUser = await UserController.getUserByPk(UserId, next);
      const notes = `"${name}" telah ditambahkan pada inventory dengan category "${category}" pada ${formatDate(
        createdAt
      )} oleh ${findUser.name}`;

      LogController.addItem({ ItemId, UserId, quantity, notes }, next);
      res.status(201).json({ success: true, status: 201, message: 'New item successfully created' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ItemController;
