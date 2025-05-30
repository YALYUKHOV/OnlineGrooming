'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Удаляем внешние ключи
    await queryInterface.removeConstraint('Appointments', 'Appointments_employee_id_fkey');
    await queryInterface.removeConstraint('Schedules', 'Schedules_employee_id_fkey');
    
    // Удаляем колонки
    await queryInterface.removeColumn('Appointments', 'employee_id');
    await queryInterface.removeColumn('Schedules', 'employee_id');
    
    // Удаляем таблицу Employees
    await queryInterface.dropTable('Employees');
  },

  down: async (queryInterface, Sequelize) => {
    // Создаем таблицу Employees
    await queryInterface.createTable('Employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Добавляем колонки обратно
    await queryInterface.addColumn('Appointments', 'employee_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Employees',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Schedules', 'employee_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Employees',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  }
}; 