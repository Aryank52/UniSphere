"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Event_1 = require("./Event");
class Feedback extends sequelize_1.Model {
    id;
    eventId;
    studentId;
    rating;
    comment;
}
exports.Feedback = Feedback;
Feedback.init({
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
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'feedbacks',
    timestamps: true
});
Feedback.belongsTo(Event_1.Event, { as: 'event', foreignKey: 'eventId' });
Feedback.belongsTo(User_1.User, { as: 'student', foreignKey: 'studentId' });
