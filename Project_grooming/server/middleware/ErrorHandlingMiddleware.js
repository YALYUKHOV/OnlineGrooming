const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next) {//параметры ошибка запрос ответ и следующий , который передаст управление следующему middleware
    console.error('Error details:', err);
    
    if(err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
        });
    }
    
    return res.status(500).json({
        message: 'Непредвиденная ошибка',
        error: err.message
    });
}