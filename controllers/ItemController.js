const { Item } = require('../models/index');

class ItemController {
  static async getItems(req, res, next) {
    try {
      const UserId = req.user.id;
      const findItems = await Item.findAll({
        where: { UserId },
      });
      res.json({ findItems });
    } catch (err) {
      console.log(err.name);
      next(err);
    }
  }

  static async postItems(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ItemController;
