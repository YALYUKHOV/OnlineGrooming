require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const routers = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

// Настройка CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Middleware для парсинга JSON

// Middleware для обработки статических файлов
const staticPath = path.resolve(__dirname, 'static');
console.log('Static files path:', staticPath);
app.use('/static', express.static(staticPath, {
    setHeaders: (res, path, stat) => {
        console.log('Serving static file:', path);
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
}));

app.use(fileUpload({})); // Middleware для обработки файлов

// Отладочный middleware для логирования запросов
app.use((req, res, next) => {
    console.log('=== Request Details ===');
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('=====================');
    next();
});

// Отладочный middleware для проверки маршрутов
app.use((req, res, next) => {
    console.log('=== Route Debug ===');
    console.log('Base URL:', req.baseUrl);
    console.log('Original URL:', req.originalUrl);
    console.log('Path:', req.path);
    console.log('==================');
    next();
});

app.use('/api', routers); // Подключение роутов

// Обработка ошибок, должен быть в конце, по скольку на нем работы прекращается и на клиент ответ
app.use(errorHandler); 

const start = async () => {
    try {
        await sequelize.authenticate()
            .then(() => console.log('Подключение к базе данных успешно!'))
            .catch(err => console.error('Ошибка подключения:', err));
        await sequelize.sync(); // Синхронизация моделей с базой данных
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Available routes:');
            console.log('- POST /api/client/registration');
            console.log('- POST /api/client/login');
            console.log('- GET /api/client/check');
            console.log('- POST /api/client/logout');
        });
    } catch (e) {
        console.log(e);
    }
}

start();





