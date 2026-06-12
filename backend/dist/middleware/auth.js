"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || '5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437';
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authentication token missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.User.findByPk(decoded.id);
        if (!user) {
            res.status(401).json({ message: 'User no longer exists' });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
}
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Unauthorized access' });
            return;
        }
        next();
    };
}
