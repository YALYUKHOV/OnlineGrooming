'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Получаем текущую дату
    const now = new Date();
    
    // Создаем массив записей на ближайшие 7 дней
    const schedules = [];
    
    // Генерируем записи на каждый день
    for (let day = 0; day < 7; day++) {
      // Для каждого дня создаем слоты с 9:00 до 18:00 с интервалом в 30 минут
      for (let hour = 9; hour < 18; hour++) {
        // Создаем два слота для каждого часа (в начале часа и в середине)
        for (let minute = 0; minute < 60; minute += 30) {
          const date = new Date(now);
          date.setDate(date.getDate() + day);
          date.setHours(hour, minute, 0, 0);
          
          schedules.push({
            date_time: date,
            is_available: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    return queryInterface.bulkInsert('Schedules', schedules, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем все записи, созданные этой миграцией
    return queryInterface.bulkDelete('Schedules', null, {});
  }
}; 