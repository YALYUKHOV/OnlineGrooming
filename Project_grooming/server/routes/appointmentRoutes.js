const Router = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

const router = new Router();

// Публичные маршруты
router.get('/user', authMiddleware, appointmentController.getUserAppointments);
router.post('/', authMiddleware, appointmentController.create);
router.put('/:id/cancel', authMiddleware, appointmentController.cancelAppointment);

// Админские маршруты
router.get('/', authMiddleware, checkRoleMiddleware('ADMIN'), appointmentController.getAll);

module.exports = router;