const {Schedule, Employee, Appointment} = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class ScheduleController{
    async create(req, res, next) {
      try {
        const { date_time, employee_id } = req.body;

        // Проверяем существование мастера
        const employee = await Employee.findByPk(employee_id);
        if (!employee) {
          return next(ApiError.badRequest('Мастер не найден'));
        }

        const schedule = await Schedule.create({ date_time, employee_id });
        return res.json(schedule);
      } catch (e) {
        console.error('Ошибка при создании записи в расписании:', e);
        return next(ApiError.internal(e.message));
      }
    }
  
    async getAll(req, res, next) {
      try {
        const schedules = await Schedule.findAll({
          include: [{
            model: Employee,
            attributes: ['id', 'name']
          }],
          order: [['date_time', 'ASC']]
        });
        return res.json(schedules);
      } catch (e) {
        next(ApiError.badRequest(e.message));
      }
    }
  
    async delete(req, res, next) {
      try {
        const { id } = req.params;
        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
          return next(ApiError.badRequest('Запись в расписании не найдена'));
        }
        await schedule.destroy();
        return res.json({ message: 'Запись в расписании удалена' });
      } catch (e) {
        next(ApiError.badRequest(e.message));
      }
    }
  
    async update(req, res, next) {
      try {
        const { id } = req.params;
        const { date_time, employee_id, is_available } = req.body;
        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
          return next(ApiError.badRequest('Запись в расписании не найдена'));
        }
        await schedule.update({
          date_time,
          employee_id,
          is_available
        });
        return res.json(schedule);
      } catch (e) {
        next(ApiError.badRequest(e.message));
      }
    }

    // Создание слотов на день
    async createDaySlots(req, res, next) {
        try {
            const { date } = req.body;
            const startDate = new Date(date);
            startDate.setHours(9, 0, 0, 0); // Начало в 9:00
            const endDate = new Date(date);
            endDate.setHours(21, 0, 0, 0); // Конец в 21:00

            // Проверяем, существуют ли уже слоты на эту дату
            const existingSlots = await Schedule.findAll({
                where: {
                    date_time: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });

            if (existingSlots.length > 0) {
                return res.json(existingSlots);
            }

            // Создаем слоты по 30 минут
            const slots = [];
            const currentDate = new Date(startDate);

            while (currentDate < endDate) {
                slots.push({
                    date_time: new Date(currentDate),
                    is_available: true
                });
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            const createdSlots = await Schedule.bulkCreate(slots);
            return res.json(createdSlots);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение доступных слотов на день
    async getAvailableSlots(req, res, next) {
        try {
            const { date } = req.query;
            console.log('Получен запрос на получение слотов для даты:', date);

            if (!date) {
                console.log('Дата не указана');
                return next(ApiError.badRequest('Не указана дата'));
            }

            // Проверяем формат даты (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                console.log('Неверный формат даты:', date);
                return next(ApiError.badRequest('Неверный формат даты. Используйте формат YYYY-MM-DD'));
            }

            const startDate = new Date(date);
            if (isNaN(startDate.getTime())) {
                console.log('Неверная дата:', date);
                return next(ApiError.badRequest('Неверная дата'));
            }

            console.log('Начальная дата:', startDate);
            startDate.setHours(9, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(21, 0, 0, 0);
            console.log('Конечная дата:', endDate);

            // Получаем все слоты на день
            let slots = await Schedule.findAll({
                where: {
                    date_time: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [['date_time', 'ASC']]
            });
            console.log('Найдено слотов:', slots.length);

            // Если слотов нет, создаем их
            if (slots.length === 0) {
                console.log('Создаем новые слоты');
                const slotsData = [];
                const currentDate = new Date(startDate);

                while (currentDate < endDate) {
                    slotsData.push({
                        date_time: new Date(currentDate),
                        is_available: true
                    });
                    currentDate.setMinutes(currentDate.getMinutes() + 30);
                }

                slots = await Schedule.bulkCreate(slotsData);
                console.log('Создано новых слотов:', slots.length);
            }

            // Получаем занятые слоты
            const bookedSlots = await Appointment.findAll({
                where: {
                    status: {
                        [Op.notIn]: ['отменено']
                    }
                },
                include: [{
                    model: Schedule,
                    where: {
                        date_time: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                }]
            });
            console.log('Найдено занятых слотов:', bookedSlots.length);

            // Помечаем занятые слоты как недоступные
            const bookedSlotIds = bookedSlots.map(slot => slot.schedule_id);
            slots = slots.map(slot => ({
                ...slot.toJSON(),
                is_available: !bookedSlotIds.includes(slot.id)
            }));

            return res.json(slots);
        } catch (e) {
            console.error('Подробная ошибка в getAvailableSlots:', {
                message: e.message,
                stack: e.stack,
                query: req.query
            });
            next(ApiError.badRequest(e.message));
        }
    }

    // Проверка доступности слотов для услуги
    async checkSlotsAvailability(req, res, next) {
        try {
            const { date, serviceId, duration } = req.query;
            const startDate = new Date(date);
            startDate.setHours(9, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(21, 0, 0, 0);

            // Получаем все слоты на день
            const slots = await Schedule.findAll({
                where: {
                    date_time: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [['date_time', 'ASC']]
            });

            // Получаем занятые слоты
            const bookedSlots = await Appointment.findAll({
                where: {
                    date_time: {
                        [Op.between]: [startDate, endDate]
                    },
                    status: {
                        [Op.notIn]: ['отменено']
                    }
                },
                include: [{
                    model: Schedule,
                    as: 'schedule'
                }]
            });

            // Помечаем занятые слоты
            const bookedSlotIds = bookedSlots.map(slot => slot.schedule_id);
            
            // Проверяем доступность слотов с учетом длительности услуги
            const availableSlots = slots.filter((slot, index) => {
                if (bookedSlotIds.includes(slot.id)) return false;
                
                // Проверяем, достаточно ли последовательных свободных слотов
                const requiredSlots = Math.ceil(duration / 30);
                const hasEnoughSlots = slots.slice(index, index + requiredSlots)
                    .every(s => !bookedSlotIds.includes(s.id));
                
                return hasEnoughSlots;
            });

            return res.json(availableSlots);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}
  
module.exports = new ScheduleController();