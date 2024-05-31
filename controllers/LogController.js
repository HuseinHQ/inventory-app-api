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

  static async createLog({ ItemId, UserId, activityType, quantity, notes }, next) {
    console.log({ ItemId, UserId, activityType, quantity, notes });
    try {
      await Log.create({ ItemId, UserId, activityType, quantity, notes });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LogController;
