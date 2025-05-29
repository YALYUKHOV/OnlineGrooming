'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Services', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Категория услуги'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Services', 'category');
  }
}; 