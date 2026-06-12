"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
class Notification extends sequelize_1.Model {
    id;
    userId;
    title;
    message;
    type;
    isRead;
}
exports.Notification = Notification;
Notification.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('ALERT', 'EVENT_APPROVAL', 'REGISTRATION'),
        allowNull: false,
        defaultValue: 'ALERT'
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'notifications',
    timestamps: true
});
Notification.belongsTo(User_1.User, { as: 'user', foreignKey: 'userId' });
User_1.User.hasMany(Notification, { foreignKey: 'userId' });
