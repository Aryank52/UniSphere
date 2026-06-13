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
    academicYear;
    interests;
    skills;
    preferredCategories;
    xpPoints;
    level;
    isEmailVerified;
    twoFactorSecret;
    isTwoFactorEnabled;
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
        type: sequelize_1.DataTypes.ENUM('STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'),
        allowNull: false,
        defaultValue: 'STUDENT'
    },
    department: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    academicYear: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    interests: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    skills: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    preferredCategories: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    xpPoints: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    isEmailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    twoFactorSecret: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    isTwoFactorEnabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
