'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('refresh_tokens', 'expiresAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL \'7 days\'')
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('refresh_tokens', 'expiresAt');
  }
}; 