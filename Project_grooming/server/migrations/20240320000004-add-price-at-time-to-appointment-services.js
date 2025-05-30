'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointment_services', 'price_at_time', {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'Цена услуги на момент записи'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Appointment_services', 'price_at_time');
  }
}; 