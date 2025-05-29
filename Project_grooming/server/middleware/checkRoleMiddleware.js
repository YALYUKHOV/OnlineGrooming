const ApiError = require('../error/ApiError');

module.exports = function(role) {
    return function(req, res, next) {
        try {
            if (req.user.role !== role) {
                return next(ApiError.forbidden('Нет доступа'));
            }
            
            next();
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    };
}; 