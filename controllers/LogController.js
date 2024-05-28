const { Log } = require('../models/index');

class LogController {
  static async getLogs(req, res, next) {
    try {
      const UserId = req.user.id;
      const findLogs = await Log.findAll({ where: { UserId } });
      res.json({ success: true, status: 200, data: findLogs });
    } catch (err) {
      next(err);
    }
  }

  static async addItem({ ItemId, UserId, quantity, notes }, next) {
    await Log.create({ ItemId, UserId, activityType: 'add', quantity, notes });
    try {
    } catch (err) {
      next(err);
    }
  }

  static async updateItem({ ItemId, UserId, quantity, notes }, next) {
    await Log.create({ ItemId, UserId, activityType: 'Update', quantity, notes });
    try {
    } catch (err) {
      next(err);
    }
  }

  static async removeItem({ ItemId, UserId, quantity, notes }, next) {
    await Log.create({ ItemId, UserId, activityType: 'Remove', quantity, notes });
    try {
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LogController;
