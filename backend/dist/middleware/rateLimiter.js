"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = rateLimiter;
const ipRequestCounts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 200; // 200 requests per 15 minutes per IP
function rateLimiter(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = ipRequestCounts.get(ip);
    if (!record || now > record.resetTime) {
        ipRequestCounts.set(ip, {
            count: 1,
            resetTime: now + WINDOW_MS
        });
        next();
        return;
    }
    record.count += 1;
    if (record.count > MAX_REQUESTS) {
        res.status(429).json({
            message: 'Too many requests from this IP, please try again after 15 minutes.'
        });
        return;
    }
    next();
}
