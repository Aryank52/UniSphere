"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubMember = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Club_1 = require("./Club");
class ClubMember extends sequelize_1.Model {
    id;
    clubId;
    userId;
    joinedAt;
}
exports.ClubMember = ClubMember;
ClubMember.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clubId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Club_1.Club,
            key: 'id'
        }
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    joinedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'club_members',
    timestamps: true
});
ClubMember.belongsTo(Club_1.Club, { as: 'club', foreignKey: 'clubId' });
Club_1.Club.hasMany(ClubMember, { foreignKey: 'clubId' });
ClubMember.belongsTo(User_1.User, { as: 'user', foreignKey: 'userId' });
User_1.User.hasMany(ClubMember, { foreignKey: 'userId' });
