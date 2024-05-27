'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Log.belongsTo(models.User);
      Log.belongsTo(models.Item);
    }
  }
  Log.init(
    {
      ItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'ItemId is required' },
          notEmpty: { msg: 'ItemId is required' },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'UserId is required' },
          notEmpty: { msg: 'UserId is required' },
        },
      },
      activityType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [['add', 'remove', 'update']],
            msg: 'The value of activityType must be one of ["add", "remove", "update"]',
          },
          notNull: { msg: 'activityType is required' },
          notEmpty: { msg: 'activityType is required' },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'quantity is required' },
          notEmpty: { msg: 'quantity is required' },
          min: { args: 1, msg: 'Minimum quantity value is 1' },
        },
      },
      notes: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Log',
    }
  );
  return Log;
};
