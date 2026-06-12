"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
    id;
    name;
    email;
    password;
    role;
    department;
    profileImage;
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('STUDENT', 'FACULTY', 'ADMIN'),
        allowNull: false,
        defaultValue: 'STUDENT'
    },
    department: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    profileImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'users',
    timestamps: true
});
