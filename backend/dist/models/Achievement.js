"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Achievement = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Achievement extends sequelize_1.Model {
    id;
    title;
    description;
    badgeImage;
    xpBonus;
}
exports.Achievement = Achievement;
Achievement.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    badgeImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    xpBonus: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'achievements',
    timestamps: true
});
