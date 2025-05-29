const Router = require('express');
const router = Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Эндпоинты для клиентов
router.get('/available-dates', authMiddleware, appointmentController.getAvailableDates);
router.get('/user-appointments', authMiddleware, appointmentController.getUserAppointments);

// Общие CRUD операции
router.post('/', authMiddleware, appointmentController.create);
router.get('/', authMiddleware, appointmentController.getAll);
router.delete('/:id', authMiddleware, appointmentController.deleteOne);
router.put('/:id', authMiddleware, appointmentController.updateOne);

module.exports = router;