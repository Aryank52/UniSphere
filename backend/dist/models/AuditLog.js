"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
class AuditLog extends sequelize_1.Model {
    id;
    userId;
    action;
    ipAddress;
    details;
}
exports.AuditLog = AuditLog;
AuditLog.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    action: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    details: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'audit_logs',
    timestamps: true
});
AuditLog.belongsTo(User_1.User, { as: 'user', foreignKey: 'userId' });
User_1.User.hasMany(AuditLog, { foreignKey: 'userId' });
