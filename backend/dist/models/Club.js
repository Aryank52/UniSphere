"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Club = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
class Club extends sequelize_1.Model {
    id;
    name;
    description;
    bannerImage;
    creatorId;
    membersCount;
    status;
}
exports.Club = Club;
Club.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    bannerImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    creatorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    membersCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('PENDING', 'ACTIVE'),
        allowNull: false,
        defaultValue: 'PENDING'
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'clubs',
    timestamps: true
});
Club.belongsTo(User_1.User, { as: 'creator', foreignKey: 'creatorId' });
User_1.User.hasMany(Club, { foreignKey: 'creatorId' });
