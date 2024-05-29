'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const logs = require('../data/log.json').map((log) => {
      log.createdAt = log.updatedAt = new Date();
      log.notes = JSON.stringify(log.notes);
      return log;
    });

    await queryInterface.bulkInsert('Logs', logs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Logs', null, {});
  },
};
