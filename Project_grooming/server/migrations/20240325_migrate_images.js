'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Получаем все услуги
    const services = await queryInterface.sequelize.query(
      'SELECT id, img FROM "Services" WHERE img IS NOT NULL',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Для каждой услуги обновляем поле images
    for (const service of services) {
      if (service.img) {
        await queryInterface.sequelize.query(
          'UPDATE "Services" SET images = $1::jsonb WHERE id = $2',
          {
            bind: [JSON.stringify([service.img]), service.id],
            type: queryInterface.sequelize.QueryTypes.UPDATE
          }
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Получаем все услуги
    const services = await queryInterface.sequelize.query(
      'SELECT id, images FROM "Services" WHERE images IS NOT NULL',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Для каждой услуги обновляем поле img
    for (const service of services) {
      if (service.images && service.images.length > 0) {
        await queryInterface.sequelize.query(
          'UPDATE "Services" SET img = $1 WHERE id = $2',
          {
            bind: [service.images[0], service.id],
            type: queryInterface.sequelize.QueryTypes.UPDATE
          }
        );
      }
    }
  }
}; 