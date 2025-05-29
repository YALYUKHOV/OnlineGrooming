'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Services', [
      {
        name: 'Гигиенический груминг',
        description: 'Комплексный уход за собакой: мытье, сушка, стрижка когтей, чистка ушей',
        price: 2000,
        duration: 120,
        category: 'Гигиенический груминг',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Модельная стрижка',
        description: 'Стрижка по породному стандарту или индивидуальному запросу',
        price: 3000,
        duration: 180,
        category: 'Стрижки',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Расчесывание и удаление колтунов',
        description: 'Профессиональное расчесывание и удаление колтунов',
        price: 1500,
        duration: 60,
        category: 'Уход за шерстью',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'SPA-массаж',
        description: 'Расслабляющий массаж для вашего питомца',
        price: 2500,
        duration: 45,
        category: 'SPA-процедуры',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Окрашивание шерсти',
        description: 'Безопасное окрашивание шерсти специальными красками',
        price: 3500,
        duration: 120,
        category: 'Дополнительные услуги',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Services', null, {});
  }
}; 