"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recommendation = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Event_1 = require("./Event");
class Recommendation extends sequelize_1.Model {
    id;
    studentId;
    eventId;
    score;
    recommendationReason;
}
exports.Recommendation = Recommendation;
Recommendation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    studentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    eventId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Event_1.Event,
            key: 'id'
        }
    },
    score: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.5
    },
    recommendationReason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'recommendations',
    timestamps: true
});
Recommendation.belongsTo(Event_1.Event, { as: 'event', foreignKey: 'eventId' });
Recommendation.belongsTo(User_1.User, { as: 'student', foreignKey: 'studentId' });
