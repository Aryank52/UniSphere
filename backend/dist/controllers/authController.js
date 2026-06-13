"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.verifyEmail = verifyEmail;
exports.resetPasswordRequest = resetPasswordRequest;
exports.resetPassword = resetPassword;
exports.updateOnboarding = updateOnboarding;
exports.enable2FA = enable2FA;
exports.verify2FA = verify2FA;
exports.getSessions = getSessions;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const SessionTrack_1 = require("../models/SessionTrack");
const AuditLog_1 = require("../models/AuditLog");
const notificationService_1 = require("../services/notificationService");
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
            department: department || null,
            xpPoints: 0,
            level: 1,
            isEmailVerified: false,
            profileImage: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`
        });
        // Create activation token
        const activationToken = jsonwebtoken_1.default.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
        const verificationUrl = `http://localhost:5173/verify-email?token=${activationToken}`;
        await notificationService_1.NotificationService.sendEmail(newUser.email, 'Welcome to UniSphere - Please Verify Your Email', `<div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #38bdf8;">Welcome, ${newUser.name}!</h2>
        <p>Thank you for registering on UniSphere. To access your student dashboard and campus events, please verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 15px 0;">Verify My Email</a>
        <p style="color: #94a3b8; font-size: 11px;">If you didn't request this registration, you can safely ignore this email.</p>
       </div>`);
        // Generate login token
        const tokenJti = `jti_${Date.now()}_${newUser.id}`;
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role, jti: tokenJti }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        // Track active session device
        await SessionTrack_1.SessionTrack.create({
            userId: newUser.id,
            tokenJti,
            deviceInfo: req.headers['user-agent'] || 'Unknown Device',
            ipAddress: req.ip || '127.0.0.1',
            isActive: true
        });
        // Log security audit trail
        await AuditLog_1.AuditLog.create({
            userId: newUser.id,
            action: 'USER_REGISTERED',
            ipAddress: req.ip || '127.0.0.1',
            details: `User registered with role ${newUser.role} and email ${newUser.email}`
        });
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
        const tokenJti = `jti_${Date.now()}_${user.id}`;
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, jti: tokenJti }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        // Track active session device
        await SessionTrack_1.SessionTrack.create({
            userId: user.id,
            tokenJti,
            deviceInfo: req.headers['user-agent'] || 'Unknown Device',
            ipAddress: req.ip || '127.0.0.1',
            isActive: true
        });
        // Log security audit trail
        await AuditLog_1.AuditLog.create({
            userId: user.id,
            action: 'USER_LOGIN',
            ipAddress: req.ip || '127.0.0.1',
            details: `User logged in from ${req.headers['user-agent'] || 'unknown'}`
        });
        res.status(200).json({ user, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred during login' });
    }
}
async function logout(req, res) {
    try {
        if (req.user) {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token) {
                const decoded = jsonwebtoken_1.default.decode(token);
                if (decoded && decoded.jti) {
                    await SessionTrack_1.SessionTrack.update({ isActive: false }, { where: { tokenJti: decoded.jti } });
                }
            }
            await AuditLog_1.AuditLog.create({
                userId: req.user.id,
                action: 'USER_LOGOUT',
                ipAddress: req.ip || '127.0.0.1',
                details: 'User logged out and session terminated'
            });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Logout failed' });
    }
}
async function verifyEmail(req, res) {
    const { token } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.User.findByPk(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.isEmailVerified = true;
        await user.save();
        await AuditLog_1.AuditLog.create({
            userId: user.id,
            action: 'EMAIL_VERIFIED',
            ipAddress: req.ip || '127.0.0.1',
            details: 'Email successfully verified'
        });
        res.status(200).json({ message: 'Email verified successfully', user });
    }
    catch (err) {
        res.status(400).json({ message: 'Invalid or expired verification token' });
    }
}
async function resetPasswordRequest(req, res) {
    const { email } = req.body;
    try {
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'User with this email does not exist' });
            return;
        }
        const resetToken = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30m' });
        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
        await notificationService_1.NotificationService.sendEmail(user.email, 'UniSphere - Password Reset Request', `<div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #f97316;">Reset Your Password</h2>
        <p>A password reset request has been received for your account. Click the button below to change your password (expires in 30 mins):</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 15px 0;">Reset Password</a>
        <p style="color: #94a3b8; font-size: 11px;">If you didn't request a password reset, you can safely ignore this email.</p>
       </div>`);
        await AuditLog_1.AuditLog.create({
            userId: user.id,
            action: 'PASSWORD_RESET_REQUESTED',
            ipAddress: req.ip || '127.0.0.1',
            details: 'Password reset link sent to email'
        });
        res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to request password reset' });
    }
}
async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.User.findByPk(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        await AuditLog_1.AuditLog.create({
            userId: user.id,
            action: 'PASSWORD_RESET_COMPLETED',
            ipAddress: req.ip || '127.0.0.1',
            details: 'Password successfully updated'
        });
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (err) {
        res.status(400).json({ message: 'Invalid or expired reset token' });
    }
}
async function updateOnboarding(req, res) {
    const { department, academicYear, interests, skills, preferredCategories } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized access' });
            return;
        }
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.department = department || user.department;
        user.academicYear = academicYear !== undefined ? Number(academicYear) : user.academicYear;
        user.interests = interests || user.interests;
        user.skills = skills || user.skills;
        user.preferredCategories = preferredCategories || user.preferredCategories;
        // Add XP points for completing onboarding profile (100 XP)
        if (user.xpPoints === 0) {
            user.xpPoints = 100;
            user.level = 1;
        }
        await user.save();
        await AuditLog_1.AuditLog.create({
            userId: user.id,
            action: 'PROFILE_ONBOARDED',
            ipAddress: req.ip || '127.0.0.1',
            details: 'Completed profile onboarding wizard, awarded 100 XP'
        });
        res.status(200).json({ message: 'Profile completed successfully', user });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to update onboarding' });
    }
}
async function enable2FA(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Mock dynamic secret generation
        const mockSecret = `UNISPHERE_SECRET_${req.user.id}_${Date.now()}`;
        user.twoFactorSecret = mockSecret;
        await user.save();
        res.status(200).json({
            secret: mockSecret,
            qrCodeDataUrl: `otpauth://totp/UniSphere:${user.email}?secret=${mockSecret}&issuer=UniSphere`
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to enable 2FA' });
    }
}
async function verify2FA(req, res) {
    const { code } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Mock verification: any 6 digit code starting with '12' or matching '123456'
        const isValid = code === '123456' || (code && code.length === 6 && code.startsWith('12'));
        if (!isValid) {
            res.status(400).json({ message: 'Invalid verification code' });
            return;
        }
        user.isTwoFactorEnabled = true;
        await user.save();
        await AuditLog_1.AuditLog.create({
            userId: user.id,
            action: '2FA_ENABLED',
            ipAddress: req.ip || '127.0.0.1',
            details: 'Two-Factor Authentication activated'
        });
        res.status(200).json({ message: '2FA enabled successfully', user });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to verify 2FA' });
    }
}
async function getSessions(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const sessions = await SessionTrack_1.SessionTrack.findAll({
            where: { userId: req.user.id },
            order: [['lastActive', 'DESC']]
        });
        res.status(200).json(sessions);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to fetch session list' });
    }
}
