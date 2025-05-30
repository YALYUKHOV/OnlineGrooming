const Router = require('express');
const router = Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// Получение всех активных услуг (публичный доступ)
router.get('/', serviceController.getAll);

// Получение всех услуг для админ-панели (только для админа)
router.get('/admin', authMiddleware, checkRole('ADMIN'), serviceController.getAllForAdmin);

// Получение услуги по id (публичный доступ)
router.get('/:id', serviceController.getOne);

// Создание услуги (только для админа)
router.post('/', authMiddleware, checkRole('ADMIN'), serviceController.create);

// Обновление услуги (только админ)
router.put('/:id', authMiddleware, checkRole('ADMIN'), serviceController.update);

// Удаление услуги (только админ)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), serviceController.delete);

// Загрузка изображения (только админ)
router.post('/upload', authMiddleware, checkRole('ADMIN'), serviceController.uploadImage);

// Переключение статуса услуги (только для админа)
router.put('/:id/toggle', authMiddleware, checkRole('ADMIN'), serviceController.toggleServiceStatus);

module.exports = router;