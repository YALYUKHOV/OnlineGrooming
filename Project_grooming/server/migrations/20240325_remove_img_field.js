'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'img');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Services', 'img', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
}; 