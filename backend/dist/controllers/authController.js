"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || '5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437';
const JWT_EXPIRATION = '24h';
async function register(req, res) {
    const { name, email, password, role, department } = req.body;
    try {
        const existingUser = await User_1.User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password || 'password', 10);
        const newUser = await User_1.User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'STUDENT',
            department: department || 'General Science',
            profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        res.status(201).json({ user: newUser, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred during registration' });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password || 'password', user.password);
        if (!isValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        res.status(200).json({ user, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred during login' });
    }
}
