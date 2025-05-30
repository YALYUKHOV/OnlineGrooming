const { Appointment, Service, Schedule, Employee, AppointmentService, Client } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class AppointmentController {
    async create(req, res, next) {
        try {
            const { serviceId, scheduleId, dateTime } = req.body;
            const client_id = req.user.id;

            // Проверяем существование услуги
            const service = await Service.findOne({
                where: { id: serviceId }
            });

            if (!service) {
                return next(ApiError.badRequest('Услуга не найдена'));
            }

            // Проверяем существование и доступность слота
            const schedule = await Schedule.findOne({
                where: {
                    id: scheduleId,
                    is_available: true
                }
            });

            if (!schedule) {
                return next(ApiError.badRequest('Выбранное время недоступно'));
            }

            // Проверяем, не занято ли время
            const existingAppointment = await Appointment.findOne({
                where: { schedule_id: scheduleId }
            });

            if (existingAppointment) {
                return next(ApiError.badRequest('Выбранное время уже занято'));
            }

            // Создаем запись
            const appointment = await Appointment.create({
                date_time: dateTime,
                client_id,
                schedule_id: scheduleId,
                status: 'запланировано',
                total_price: service.price
            });

            // Добавляем услугу к записи
            await appointment.addService(service);

            // Обновляем статус слота
            await schedule.update({ is_available: false });

            // Получаем полную информацию о созданной записи
            const createdAppointment = await Appointment.findByPk(appointment.id, {
                include: [
                    {
                        model: Service,
                        through: { attributes: [] }
                    }
                ]
            });

            return res.json(createdAppointment);
        } catch (e) {
            console.error('Ошибка при создании записи:', e);
            return next(ApiError.internal(e.message));
        }
    }

    async getUserAppointments(req, res, next) {
        try {
            const client_id = req.user.id;
            const role = req.user.role;
            
            // Если пользователь админ, получаем все записи, иначе только записи конкретного пользователя
            const whereClause = role === 'ADMIN' ? {} : { client_id };
            
            const appointments = await Appointment.findAll({
                where: whereClause,
                include: [
                    {
                        model: Service,
                        as: 'services',
                        through: { attributes: ['price_at_time'] }
                    },
                    {
                        model: Client,
                        as: 'Client',
                        attributes: ['id', 'name', 'phone', 'email']
                    }
                ],
                order: [['date_time', 'DESC']]
            });

            // Форматируем данные для отображения
            const formattedAppointments = appointments.map(appointment => {
                const service = appointment.services[0]; // Берем первую услугу
                const client = appointment.Client;

                return {
                    ...appointment.toJSON(),
                    service_name: service ? service.name : 'Услуга не указана',
                    service_price: service ? service.price : 0,
                    client_name: client ? client.name : 'Клиент не указан',
                    client_phone: client ? client.phone : 'Телефон не указан',
                    client_email: client ? client.email : 'Email не указан',
                    date_time: appointment.date_time
                };
            });

            return res.json(formattedAppointments);
        } catch (e) {
            console.error('Ошибка при получении записей:', e);
            return next(ApiError.internal(e.message));
        }
    }

    async cancelAppointment(req, res, next) {
        try {
            const { id } = req.params;
            const client_id = req.user.id;

            const appointment = await Appointment.findOne({
                where: { id, client_id },
                include: [{ model: Schedule }]
            });

            if (!appointment) {
                return next(ApiError.notFound('Запись не найдена'));
            }

            // Обновляем статус записи
            await appointment.update({ status: 'отменено' });

            // Освобождаем слот
            if (appointment.Schedule) {
                await appointment.Schedule.update({ is_available: true });
            }

            return res.json({ message: 'Запись успешно отменена' });
        } catch (e) {
            console.error('Ошибка при отмене записи:', e);
            return next(ApiError.internal(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const appointments = await Appointment.findAll({
                include: [
                    {
                        model: Service,
                        as: 'services',
                        through: { attributes: ['price_at_time'] }
                    },
                    {
                        model: Client,
                        as: 'Client',
                        attributes: ['id', 'name', 'phone', 'email']
                    }
                ],
                order: [['date_time', 'DESC']]
            });

            // Форматируем данные для отображения
            const formattedAppointments = appointments.map(appointment => {
                const service = appointment.services[0];
                const client = appointment.Client;

                return {
                    id: appointment.id,
                    date_time: appointment.date_time,
                    status: appointment.status,
                    total_price: appointment.total_price,
                    notes: appointment.notes,
                    service_name: service ? service.name : 'Услуга не указана',
                    service_price: service ? service.price : 0,
                    client_name: client ? client.name : 'Клиент не указан',
                    client_phone: client ? client.phone : 'Телефон не указан',
                    client_email: client ? client.email : 'Email не указан'
                };
            });

            return res.json(formattedAppointments);
        } catch (e) {
            console.error('Error in getAll:', e);
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение доступных дат
    async getAvailableDates(req, res, next) {
        try {
            // Получаем все записи в расписании
            const schedules = await Schedule.findAll({
                where: {
                    is_available: true
                },
                include: [{
                    model: Employee,
                    attributes: ['id', 'name']
                }],
                order: [['date_time', 'ASC']]
            });

            // Получаем все существующие записи
            const appointments = await Appointment.findAll({
                attributes: ['schedule_id']
            });

            // Создаем множество занятых расписаний
            const bookedScheduleIds = new Set(appointments.map(a => a.schedule_id));

            // Фильтруем доступные даты
            const availableDates = schedules
                .filter(schedule => !bookedScheduleIds.has(schedule.id))
                .map(schedule => ({
                    id: schedule.id,
                    date_time: schedule.date_time,
                    employee: schedule.Employee
                }));

            return res.json({ dates: availableDates });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new AppointmentController();