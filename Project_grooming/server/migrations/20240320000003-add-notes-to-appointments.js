'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Дополнительные заметки к записи'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Appointments', 'notes');
  }
}; 