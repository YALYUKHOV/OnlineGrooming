const Router = require('express');
const router = Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// Получение всех услуг (публичный доступ)
router.get('/', serviceController.getAll);

// Получение услуги по id (публичный доступ)
router.get('/:id', serviceController.getOne);

// Создание новой услуги (только админ)
router.post('/', authMiddleware, checkRole('ADMIN'), serviceController.create);

// Обновление услуги (только админ)
router.put('/:id', authMiddleware, checkRole('ADMIN'), serviceController.update);

// Удаление услуги (только админ)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), serviceController.delete);

// Загрузка изображения (только админ)
router.post('/upload', authMiddleware, checkRole('ADMIN'), serviceController.uploadImage);

module.exports = router;