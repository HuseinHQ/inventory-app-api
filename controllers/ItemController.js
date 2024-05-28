const { Item, sequelize, Log } = require('../models/index');
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
      const { name, quantity, category, condition, location, order_by, desc } = req.query;
      const attribute = [
        'name',
        'quantity',
        'category',
        'condition',
        'location',
        'isFavorite',
        'createdAt',
        'updatedAt',
      ];

      if (name) where.name = { [Op.iLike]: `%${name}%` };
      if (category) where.category = { [Op.like]: category };
      if (condition && (condition === 'new' || condition === 'second')) where.condition = { [Op.like]: condition };
      if (location) where.location = { [Op.iLike]: `%${location}%` };
      if (order_by) {
        const [orderBy, direction] = order_by.split(':');
        if (attribute.includes(orderBy)) {
          order.push([orderBy, direction ? direction : 'ASC']);
        }
      }

      const findItems = await Item.findAll({
        where,
        order,
      });
      res.json({ success: true, status: 200, data: findItems });
    } catch (err) {
      next(err);
    }
  }

  static async getFavoriteItems(req, res, next) {
    try {
      const UserId = req.user.id;
      const findFavorites = await Item.findAll({
        where: { UserId, isFavorite: true },
      });
      res.json({ success: true, status: 200, data: findFavorites });
    } catch (err) {
      next(err);
    }
  }

  static async getItemDetail(req, res, next) {
    try {
      const { id } = req.params;
      const findItem = await Item.findByPk(id, {
        include: [Log],
      });
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

  static async getCategories(req, res, next) {
    try {
      const UserId = req.user.id;
      const findCategories = await Item.findAll({
        where: {
          UserId,
        },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      });
      const categories = findCategories.map((item) => item.category);

      res.json({ success: true, status: 200, data: categories });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ItemController;
