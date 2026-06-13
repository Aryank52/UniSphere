"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Event_1 = require("./Event");
class Registration extends sequelize_1.Model {
    id;
    eventId;
    studentId;
    status;
    passCode;
    event;
    student;
}
exports.Registration = Registration;
Registration.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    eventId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Event_1.Event,
            key: 'id'
        }
    },
    studentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('REGISTERED', 'CANCELLED', 'WAITLISTED'),
        allowNull: false,
        defaultValue: 'REGISTERED'
    },
    passCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'registrations',
    timestamps: true
});
Registration.belongsTo(Event_1.Event, { as: 'event', foreignKey: 'eventId' });
Event_1.Event.hasMany(Registration, { foreignKey: 'eventId' });
Registration.belongsTo(User_1.User, { as: 'student', foreignKey: 'studentId' });
User_1.User.hasMany(Registration, { foreignKey: 'studentId' });
