const { Item, sequelize, Log, User } = require('../models/index');
const { Op, where } = require('sequelize');
const LogController = require('./LogController');
const formatDate = require('../helpers/formatDate');
const fs = require('fs');
const path = require('path');
const { HOST, PORT } = process.env;
const imgUrl = (imgName) => `${HOST}:${PORT}/uploads/images/${imgName.split(' ').join('%20')}`;

class ItemController {
  static async getItems(req, res, next) {
    try {
      const UserId = req.user.id;
      const where = { UserId };
      let order = [];
      const { name, category, condition, location, order_by, desc } = req.query;
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

      findItems.map((item) => item.image && (item.image = imgUrl(item.image)));
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

      findFavorites.map((item) => item.image && (item.image = imgUrl(item.image)));
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

      findItem.image = findItem.image && imgUrl(findItem.image);
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

      LogController.createLog({ ItemId: +ItemId, UserId, activityType: 'add', quantity, notes }, next);
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
      await LogController.createLog({ ItemId: +id, UserId, activityType: 'update', notes }, next);

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

      const properties = ['name', 'description', 'quantity', 'category', 'location', 'condition'];

      const edited = [];
      properties.forEach((property) => {
        if (req.body[property] && findItem[property] !== req.body[property]) {
          edited.push(property);
        }
      });

      let notesEn = `Item "${findItem.name}" has been edited to on ${formatDate(new Date(), 'en')}`;
      edited.forEach((property) => {
        notesEn += `\n${property} edited from "${findItem[property]}" to "${req.body[property]}"`;
      });

      let notesId = `Item "${findItem.name}" telah diedit pada ${formatDate(new Date(), 'id')}`;
      edited.forEach((property) => {
        notesId += `\n${property} diedit dari "${findItem[property]}" menjadi "${req.body[property]}"`;
      });

      const notes = { en: notesEn, id: notesId };

      if (!edited.length) {
        res.json({ success: true, status: 200, message: { en: 'No changes were made.', id: 'Tidak ada perubahan' } });
      } else {
        await Item.update(
          { name, description, quantity, category, location, condition, updatedAt: Date.now() },
          {
            where: { id: ItemId },
          }
        );

        await LogController.createLog(
          {
            ItemId: +ItemId,
            UserId,
            activityType: 'update',
            quantity: quantity ?? findItem.quantity,
            notes,
          },
          next
        );
      }

      res.status(200).json({
        success: true,
        status: 200,
        message: {
          en: `Item "${findItem.name}" successfully updated!`,
          id: `Item "${findItem.name}" berhasil diupdate!`,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const { id: ItemId } = req.params;
      const UserId = req.user.id;
      const findItem = await Item.findByPk(ItemId);

      if (findItem.image) {
        const imagePath = path.join(__dirname, '..', 'uploads', 'images', findItem.image);
        fs.unlinkSync(imagePath);
      }

      const notesEn = `Item "${findItem.name} has been removed from inventory on ${formatDate(new Date(), 'en')}`;
      const notesId = `Item "${findItem.name} telah dihapus dari inventory pada ${formatDate(new Date(), 'id')}`;
      const notes = { en: notesEn, id: notesId };

      await LogController.createLog({ ItemId: +ItemId, UserId, activityType: 'remove', notes }, next);
      await Item.destroy({ where: { id: ItemId } });

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

  static async getImage(req, res, next) {
    try {
      const imageName = req.params.image;
      // console.log(path.join(__dirname, '..', 'uploads', 'images', imageName));
      res.status(200).sendFile(path.join(__dirname, '..', 'uploads', 'images', imageName));
    } catch (err) {
      next(err);
    }
  }

  static async postImage(req, res, next) {
    try {
      const ItemId = req.params.id;
      const UserId = req.user.id;
      const newImage = req.file;
      const findItem = await Item.findByPk(ItemId);

      if (findItem.image) {
        const oldImagePath = path.join('uploads/images', findItem.image);
        if (fs.existsSync(oldImagePath)) {
          const oldImage = fs.statSync(oldImagePath);

          if (newImage.originalName === findItem.image && newImage.size === oldImage.size) {
            return res.status(400).json({
              success: false,
              status: 400,
              message: { en: 'New image is the same as the old image', id: 'Gambar baru sama dengan gambar lama' },
            });
          }
        }
      }

      const newImagePath = path.join('uploads/images', newImage.originalname);
      fs.writeFileSync(newImagePath, newImage.buffer);

      // Update the item with the new image
      findItem.image = newImage.originalname;
      await findItem.save();

      const notesEn = `Image has been added to item "${findItem.name}"`;
      const notesId = `Gambar telah ditambahkan ke item "${findItem.name}"`;
      const notes = { en: notesEn, id: notesId };
      await LogController.createLog({ ItemId: +ItemId, UserId, activityType: 'add', notes }, next);

      res.status(201).json({
        success: true,
        status: 201,
        message: { en: 'Image uploaded successfully!', id: 'Gambar berhasil diunggah!' },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ItemController;
