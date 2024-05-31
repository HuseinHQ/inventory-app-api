const { Item, sequelize, Log, User } = require('../models/index');
const { Op, where } = require('sequelize');
const LogController = require('./LogController');
const formatDate = require('../helpers/formatDate');
const fs = require('fs');

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
      const image = req.file && req.file.path;
      const { id: ItemId, createdAt } = await Item.create({
        UserId,
        name,
        description,
        quantity,
        category,
        location,
        condition,
        image,
      });

      const notesId = `Item "${name}" telah ditambahkan ke inventory pada ${formatDate(createdAt, 'id')}`;
      const notesEn = `Item "${name}" has been added to inventory on ${formatDate(createdAt, 'en')}`;
      const notes = { en: notesEn, id: notesId };

      LogController.createLog({ ItemId, UserId, activityType: 'add', quantity, notes }, next);
      res.status(201).json({
        success: true,
        status: 201,
        message: { en: 'New item successfully added', id: 'Item baru berhasil ditambahkan' },
      });
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

  static async patchFavorite(req, res, next) {
    try {
      const { id } = req.params;
      const UserId = req.user.id;
      const findItem = await Item.findByPk(id, { include: [User] });
      await findItem.update({ isFavorite: !findItem.isFavorite });

      const messageEn = `Item "${findItem.name}" is ${findItem.isFavorite ? 'moved to' : 'removed from'} favorite`;
      const messageId = `Item "${findItem.name}" ${findItem.isFavorite ? 'dipindahkan ke' : 'dihapus dari'} favorit`;
      const message = { en: messageEn, id: messageId };

      const notesEn = `Item "${findItem.name}" is ${
        findItem.isFavorite ? 'moved to' : 'removed from'
      } favorite on ${formatDate(new Date(), 'en')}`;
      const notesId = `Item "${findItem.name}" ${
        findItem.isFavorite ? 'dipindah ke' : 'dihapus dari'
      } favorit pada ${formatDate(new Date(), 'id')}`;
      const notes = { en: notesEn, id: notesId };
      await LogController.createLog({ ItemId: id, UserId, activityType: 'update', notes }, next);

      res.json({ success: true, status: 200, message });
    } catch (err) {
      next(err);
    }
  }

  static async putItem(req, res, next) {
    try {
      const { id: UserId } = req.user;
      const { id: ItemId } = req.params;
      const findItem = await Item.findByPk(ItemId);
      const { name, description, quantity, category, location, condition } = req.body;
      const image = req.file && req.file.path;

      const properties = ['name', 'description', 'quantity', 'category', 'location', 'condition', 'image'];

      const edited = [];
      properties.forEach((property) => {
        if (image && findItem.image !== image) {
          edited.push('image');
        } else if (req.body[property] && findItem[property] !== req.body[property]) {
          edited.push(property);
        }
      });

      let notesEn = `Item "${findItem.name}" has been edited to on ${formatDate(new Date(), 'en')}`;
      edited.forEach((property) => {
        console.log(req.body.description);
        notesEn += `\n${property} edited from "${findItem[property]}" to "${req.body[property]}"`;
      });

      let notesId = `Item "${findItem.name}" telah diedit pada ${formatDate(new Date(), 'id')}`;
      edited.forEach((property) => {
        notesId += `\n${property} diedit dari "${findItem[property]}" menjadi "${req.body[property]}"`;
      });

      const notes = { en: notesEn, id: notesId };

      if (!edited.length) {
        res.json({ success: true, status: 200, message: 'No changes were made.' });
      }

      await Item.update(
        { name, image, description, quantity, category, location, condition, updatedAt: Date.now() },
        {
          where: { id: ItemId },
        }
      );
      await LogController.createLog(
        {
          ItemId,
          UserId,
          activityType: 'update',
          quantity: quantity ?? findItem.quantity,
          notes,
        },
        next
      );

      res.status(200).json({
        success: true,
        status: 200,
        message: {
          en: `Item "${findItem.name}" successfully updated!`,
          id: `Item "${findItem.name}" berhasil diupdate!`,
        },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const { id: ItemId } = req.params;
      const UserId = req.user.id;
      const findItem = await Item.findByPk(ItemId);
      await Item.destroy({ where: { id: ItemId } });

      const notesEn = `Item "${findItem.name} has been removed from inventory on ${formatDate(new Date(), 'en')}`;
      const notesId = `Item "${findItem.name} telah dihapus dari inventory pada ${formatDate(new Date(), 'id')}`;
      const notes = { en: notesEn, id: notesId };

      if (findItem.image) {
        fs.unlinkSync(findItem.image);
      }

      await LogController.createLog({ ItemId, UserId, activityType: 'remove', notes }, next);

      res.status(200).json({
        success: true,
        status: 200,
        message: {
          en: `Item "${findItem.name}" successfully removed from inventory`,
          id: `Item "${findItem.name}" berhasil dihapus dari inventory`,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ItemController;
