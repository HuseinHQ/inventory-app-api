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
      Log.belongsTo(models.User, {
        foreignKey: {
          name: 'UserId',
          onDelete: 'SET NULL',
        },
      });
      Log.belongsTo(models.Item, {
        foreignKey: {
          name: 'ItemId',
          onDelete: 'SET NULL',
        },
      });
    }
  }
  Log.init(
    {
      ItemId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: { msg: 'ItemId is required' },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        validate: {
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
        validate: {
          min: { args: 1, msg: 'Minimum quantity value is 1' },
        },
      },
      notes: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Log',
    }
  );
  return Log;
};
