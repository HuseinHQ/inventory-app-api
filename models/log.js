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
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'item_id is required' },
          notEmpty: { msg: 'item_id is required' },
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'user_id is required' },
          notEmpty: { msg: 'user_id is required' },
        },
      },
      activity_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [['add', 'remove', 'update']],
            msg: 'The value of activity_type must be one of ["add", "remove", "update"]',
          },
          notNull: { msg: 'activity_type is required' },
          notEmpty: { msg: 'activity_type is required' },
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