"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionTrack = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
class SessionTrack extends sequelize_1.Model {
    id;
    userId;
    tokenJti;
    deviceInfo;
    ipAddress;
    isActive;
    lastActive;
}
exports.SessionTrack = SessionTrack;
SessionTrack.init({
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
    tokenJti: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    deviceInfo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    lastActive: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'session_tracks',
    timestamps: true
});
SessionTrack.belongsTo(User_1.User, { as: 'user', foreignKey: 'userId' });
User_1.User.hasMany(SessionTrack, { foreignKey: 'userId' });
