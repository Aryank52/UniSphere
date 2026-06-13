"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAchievement = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Achievement_1 = require("./Achievement");
class UserAchievement extends sequelize_1.Model {
    id;
    userId;
    achievementId;
    earnedAt;
}
exports.UserAchievement = UserAchievement;
UserAchievement.init({
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
    achievementId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Achievement_1.Achievement,
            key: 'id'
        }
    },
    earnedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'user_achievements',
    timestamps: true
});
UserAchievement.belongsTo(User_1.User, { as: 'user', foreignKey: 'userId' });
User_1.User.hasMany(UserAchievement, { foreignKey: 'userId' });
UserAchievement.belongsTo(Achievement_1.Achievement, { as: 'achievement', foreignKey: 'achievementId' });
Achievement_1.Achievement.hasMany(UserAchievement, { foreignKey: 'achievementId' });
