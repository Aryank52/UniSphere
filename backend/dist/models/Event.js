"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Club_1 = require("./Club");
class Event extends sequelize_1.Model {
    id;
    title;
    description;
    date;
    time;
    location;
    campus;
    maxCapacity;
    status;
    bannerImage;
    category;
    clubId;
    coordinatorId;
    engagementScore;
}
exports.Event = Event;
Event.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    campus: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    maxCapacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING'
    },
    bannerImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: sequelize_1.DataTypes.ENUM('TECH', 'SPORTS', 'ACADEMIC', 'CULTURAL'),
        allowNull: false,
        defaultValue: 'TECH'
    },
    clubId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Club_1.Club,
            key: 'id'
        }
    },
    coordinatorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    engagementScore: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'events',
    timestamps: true
});
Event.belongsTo(Club_1.Club, { as: 'club', foreignKey: 'clubId' });
Club_1.Club.hasMany(Event, { foreignKey: 'clubId' });
Event.belongsTo(User_1.User, { as: 'coordinator', foreignKey: 'coordinatorId' });
User_1.User.hasMany(Event, { foreignKey: 'coordinatorId' });
