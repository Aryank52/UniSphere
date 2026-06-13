"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venue = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Venue extends sequelize_1.Model {
    id;
    name;
    locationDetails;
    latitude;
    longitude;
    capacity;
}
exports.Venue = Venue;
Venue.init({
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
    locationDetails: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: sequelize_1.DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: sequelize_1.DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    capacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'venues',
    timestamps: true
});
