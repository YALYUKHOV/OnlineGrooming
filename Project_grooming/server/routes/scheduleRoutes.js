const Router = require('express');
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();

// Получение расписания
router.get('/', authMiddleware, scheduleController.getAll);

// Создание записи в расписании
router.post('/', authMiddleware, scheduleController.create);

// Обновление записи в расписании
router.put('/:id', authMiddleware, scheduleController.update);

// Удаление записи из расписания
router.delete('/:id', authMiddleware, scheduleController.delete);

// Получение доступных слотов на день (публичный доступ)
router.get('/available', scheduleController.getAvailableSlots);


// Создание слотов на день (только для админа)
router.post('/create-day', authMiddleware, scheduleController.createDaySlots);

module.exports = router;