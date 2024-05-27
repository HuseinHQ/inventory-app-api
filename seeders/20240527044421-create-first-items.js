'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = require('../data/item.json').map((item) => {
      item.createdAt = item.updatedAt = new Date();
      return item;
    });
    await queryInterface.bulkInsert('Items', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  },
};
