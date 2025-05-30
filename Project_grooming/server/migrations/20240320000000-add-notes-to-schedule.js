'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Schedules', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Примечания к расписанию'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Schedules', 'notes');
  }
}; 