'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Item);
      User.hasMany(models.Log);
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { args: [5], msg: 'Minimum name length is 5' },
          notEmpty: { msg: 'Name is required' },
          notNull: { msg: 'Name is required' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Email already taken' },
        validate: {
          isEmail: { msg: 'Email format is invalid' },
          notEmpty: { msg: 'Email is required' },
          notNull: { msg: 'Email is required' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { args: [8], msg: 'Minimum password length is 8' },
          notEmpty: { msg: 'Name is required' },
          notNull: { msg: 'Name is required' },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = hashPassword(user.password);
        },
      },
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
