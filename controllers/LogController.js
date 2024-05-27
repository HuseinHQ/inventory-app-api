const { Log } = require('../models/index');

class LogController {
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
