"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.initRedis = initRedis;
exports.getCachedData = getCachedData;
exports.setCachedData = setCachedData;
exports.invalidateCache = invalidateCache;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
exports.redisClient = (0, redis_1.createClient)({ url: redisUrl });
exports.redisClient.on('error', (err) => {
    console.warn('Redis Cache Server is offline or not configured. Running with in-memory caching bypass.', err.message);
});
let isRedisConnected = false;
async function initRedis() {
    try {
        await exports.redisClient.connect();
        isRedisConnected = true;
        console.log('Connected to Redis Cache Server successfully.');
    }
    catch (err) {
        isRedisConnected = false;
        // Suppress error since we run with fallback
    }
}
async function getCachedData(key) {
    if (!isRedisConnected)
        return null;
    try {
        const data = await exports.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (e) {
        return null;
    }
}
async function setCachedData(key, data, ttlSeconds = 3600) {
    if (!isRedisConnected)
        return;
    try {
        await exports.redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    }
    catch (e) {
        // ignore
    }
}
async function invalidateCache(key) {
    if (!isRedisConnected)
        return;
    try {
        await exports.redisClient.del(key);
    }
    catch (e) {
        // ignore
    }
}
