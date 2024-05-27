'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.belongsTo(models.User);
      Item.hasMany(models.Log);
    }
  }
  Item.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'UserId is required' },
          notEmpty: { msg: 'UserId is required' },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Name is required' },
          notEmpty: { msg: 'Name is required' },
        },
      },
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      quantity: {
        type: DataTypes.INTEGER,
        validate: {
          min: { args: 1, msg: 'Minimum quantity value is 1' },
        },
      },
      location: DataTypes.STRING,
      condition: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Item',
    }
  );
  return Item;
};
