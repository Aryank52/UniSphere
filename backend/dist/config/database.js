"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl) {
    console.log('Connecting to PostgreSQL database...');
    exports.sequelize = new sequelize_1.Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
    });
}
else {
    console.log('No DATABASE_URL found. Falling back to local zero-config SQLite file (unisphere.sqlite)...');
    exports.sequelize = new sequelize_1.Sequelize({
        dialect: 'sqlite',
        storage: './unisphere.sqlite',
        logging: false
    });
}
