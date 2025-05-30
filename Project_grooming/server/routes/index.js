const Router = require('express');
const router = Router();
const clientRoutes = require('./clientRoutes');
const serviceRoutes = require('./serviceRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const scheduleRoutes = require('./scheduleRoutes');

// Основные роуты
router.use('/client', clientRoutes);
router.use('/service', serviceRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/schedule', scheduleRoutes);

module.exports = router;