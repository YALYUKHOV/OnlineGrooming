const { Client, Appointment, Service, Employee, AppointmentService, InvalidToken, RefreshToken } = require('../models/models');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Создает access токен для доступа к защищенным ресурсам (действует 24 часа)
const generateAccessToken = (id, name, email, phone, role) => {
  if (!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined in environment variables');
  }
  return jwt.sign(
    { id, name, email, phone, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
}

// Создает refresh токен для обновления access токена (действует 7 дней)
const generateRefreshToken = () => {
  if (!process.env.REFRESH_SECRET_KEY) {
    throw new Error('REFRESH_SECRET_KEY is not defined in environment variables');
  }
  return jwt.sign(
    {},
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: '7d' }
  );
}

class ClientController {
  // Регистрация нового пользователя в системе
  async registration(req, res, next) {
    try {
      const { phone, name, email, password } = req.body;
      if (!name || !email || !password) {
        return next(ApiError.badRequest('Некорректный email или password'));
      }
      const candidate = await Client.findOne({ where: { email } });
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует'));
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const user = await Client.create({ name, email, phone, password: hashPassword });
      
      const accessToken = generateAccessToken(user.id, user.name, user.email, user.phone, user.role);
      const refreshToken = generateRefreshToken();
      
      // Устанавливаем срок действия refresh token на 7 дней
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      await RefreshToken.create({
        token: refreshToken,
        createdAt: new Date(),
        expiresAt: expiresAt,
        clientId: user.id
      });

      return res.json({
        accessToken,
        refreshToken
      });
    } catch (e) {
      console.error('Ошибка при регистрации:', e);
      return next(ApiError.internal(e.message));
    }
  }

  // Вход пользователя в систему
  async login(req, res, next) {
    try {
      console.log('Login attempt:', req.body);
      const { email, password } = req.body;
      
      if (!email || !password) {
        console.log('Missing credentials');
        return next(ApiError.badRequest('Email и пароль обязательны'));
      }

      const user = await Client.findOne({ where: { email } });
      if (!user) {
        console.log('User not found:', email);
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      console.log('Found user:', user.toJSON());

      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        console.log('Invalid password for user:', email);
        return next(ApiError.badRequest('Указан неверный пароль'));
      }
      
      const accessToken = generateAccessToken(user.id, user.name, user.email, user.phone, user.role);
      const refreshToken = generateRefreshToken();
      
      // Устанавливаем срок действия refresh token на 7 дней
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      await RefreshToken.create({
        token: refreshToken,
        createdAt: new Date(),
        expiresAt: expiresAt,
        clientId: user.id
      });

      console.log('Login successful for user:', email, 'with role:', user.role);
      return res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (e) {
      console.error('Login error:', e);
      return next(ApiError.internal(e.message));
    }
  }

  // Проверка авторизации пользователя
  async check(req, res, next) {
    try {
      const user = await Client.findByPk(req.user.id);
      if (!user) {
        return next(ApiError.unauthorized('Пользователь не найден'));
      }
      
      const token = generateAccessToken(user.id, user.name, user.email, user.phone, user.role);
      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  // Изменение пароля пользователя
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await Client.findByPk(userId);
      if (!user) {
        return next(ApiError.notFound('Пользователь не найден'));
      }

      const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
      if (!isPasswordValid) {
        return next(ApiError.badRequest('Неверный текущий пароль'));
      }

      const hashPassword = await bcrypt.hash(newPassword, 5);
      await user.update({ password: hashPassword });

      return res.json({ message: 'Пароль успешно изменен' });
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  // Выход пользователя из системы
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      // Удаляем refresh токен из базы
      if (refreshToken) {
        await RefreshToken.destroy({
          where: { token: refreshToken }
        });
      }

      // Добавляем access токен в список недействительных
      await InvalidToken.create({
        token: req.headers.authorization.split(' ')[1],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      return res.json({ message: 'Вы успешно вышли из системы' });
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  // Получение всех записей клиента
  async getClientAppointments(req, res, next) {
    try {
      const clientId = req.user.id;
      
      const appointments = await Appointment.findAll({
        where: { client_id: clientId },
        include: [
          {
            model: Service,
            through: { attributes: [] },
          },
          {
            model: Employee,
            attributes: ['id', 'name', 'position']
          }
        ],
        order: [['date_time', 'ASC']]
      });

      if (!appointments) {
        return next(ApiError.notFound('Записи не найдены'));
      }

      return res.json(appointments);
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  // Сброс пароля пользователя
  async resetPassword(req, res, next) {
    try {
      const { email, phone } = req.body;
      
      const client = await Client.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { phone: phone }
          ]
        }
      });

      if (!client) {
        return next(ApiError.notFound('Клиент не найден'));
      }

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(tempPassword, 5);

      await client.update({ password: hashPassword });

      return res.json({ 
        message: 'Пароль успешно сброшен',
        tempPassword: tempPassword
      });
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  // Обновление access и refresh токенов
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return next(ApiError.unauthorized('Refresh токен не предоставлен'));
      }

      const tokenData = await RefreshToken.findOne({
        where: { token: refreshToken }
      });

      if (!tokenData) {
        return next(ApiError.unauthorized('Недействительный refresh токен'));
      }

      // Проверяем срок действия токена
      const tokenAge = Date.now() - tokenData.createdAt.getTime();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней
      
      if (tokenAge > maxAge) {
        await tokenData.destroy();
        return next(ApiError.unauthorized('Refresh токен истек'));
      }

      const user = await Client.findByPk(tokenData.clientId);
      if (!user) {
        return next(ApiError.unauthorized('Пользователь не найден'));
      }

      // Генерируем новые токены
      const newAccessToken = generateAccessToken(user.id, user.name, user.email, user.phone, user.role);
      const newRefreshToken = generateRefreshToken();

      // Обновляем refresh токен в базе
      await tokenData.update({
        token: newRefreshToken,
        createdAt: new Date()
      });

      return res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }
}

module.exports = new ClientController();