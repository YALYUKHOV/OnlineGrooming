const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Appointment = sequelize.define("Appointment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status: { 
        type: DataTypes.ENUM("запланировано", "подтверждено", "завершено", "отменено"), 
        allowNull: false, 
        defaultValue: "запланировано" 
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Общая стоимость всех услуг в записи'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Дополнительные заметки к записи'
    }
}, {
    timestamps: true
})

const AppointmentService = sequelize.define("Appointment_service", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    price_at_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Цена услуги на момент записи'
    }
}, {
    timestamps: true
})

const Client = sequelize.define("Client", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: DataTypes.ENUM('CLIENT', 'ADMIN'),
        allowNull: false,
        defaultValue: 'CLIENT'
    },
}, {
    timestamps: true
})

const Schedule = sequelize.define("Schedule", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Примечания к расписанию'
    }
}, {
    timestamps: true
})

const Service = sequelize.define("Service", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Длительность услуги в минутах'
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Массив путей к изображениям услуги'
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Категория услуги'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    timestamps: true
})

const InvalidToken = sequelize.define("InvalidToken", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
}, {
    timestamps: true
})

const RefreshToken = sequelize.define('refresh_token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
}, {
    timestamps: true
})

// Связи между моделями
Schedule.hasMany(Appointment, { foreignKey: "schedule_id", onDelete: "CASCADE" });
Appointment.belongsTo(Schedule, { foreignKey: "schedule_id" });

Appointment.belongsToMany(Service, { 
    through: AppointmentService, 
    foreignKey: "appointment_id",
    as: 'services'
});
Service.belongsToMany(Appointment, { 
    through: AppointmentService, 
    foreignKey: "service_id",
    as: 'appointments'
});

Client.hasMany(Appointment, { foreignKey: "client_id", onDelete: "CASCADE" });
Appointment.belongsTo(Client, { foreignKey: "client_id", as: 'Client' });

RefreshToken.belongsTo(Client);
Client.hasMany(RefreshToken);

module.exports = {
    Appointment,
    AppointmentService,
    Client,
    Schedule,
    Service,
    InvalidToken,
    RefreshToken
}