'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Services', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 60,
      comment: 'Длительность услуги в минутах'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'duration');
  }
}; 