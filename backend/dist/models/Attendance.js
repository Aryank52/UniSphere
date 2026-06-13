"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Event_1 = require("./Event");
class Attendance extends sequelize_1.Model {
    id;
    eventId;
    studentId;
    checkedInAt;
    checkedOutAt;
    checkedById;
}
exports.Attendance = Attendance;
Attendance.init({
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
    checkedInAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    checkedOutAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    checkedById: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User_1.User,
            key: 'id'
        }
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'attendances',
    timestamps: false
});
Attendance.belongsTo(Event_1.Event, { as: 'event', foreignKey: 'eventId' });
Attendance.belongsTo(User_1.User, { as: 'student', foreignKey: 'studentId' });
Attendance.belongsTo(User_1.User, { as: 'checkedBy', foreignKey: 'checkedById' });
