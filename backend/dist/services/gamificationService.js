"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const User_1 = require("../models/User");
const AuditLog_1 = require("../models/AuditLog");
const Notification_1 = require("../models/Notification");
class GamificationService {
    static async awardXP(userId, xpToAdd, reason) {
        try {
            const user = await User_1.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const oldXP = user.xpPoints || 0;
            const newXP = oldXP + xpToAdd;
            // Level calculations: Level = Math.floor(XP / 200) + 1
            const newLevel = Math.floor(newXP / 200) + 1;
            const oldLevel = user.level || 1;
            const leveledUp = newLevel > oldLevel;
            user.xpPoints = newXP;
            user.level = newLevel;
            await user.save();
            // Log in AuditLog
            await AuditLog_1.AuditLog.create({
                userId: user.id,
                action: 'XP_AWARDED',
                details: `Awarded ${xpToAdd} XP for: ${reason}. Total XP: ${newXP}. Level: ${newLevel}.`
            });
            // Create notification if leveled up
            if (leveledUp) {
                await Notification_1.Notification.create({
                    userId: user.id,
                    title: '🎉 Level Up!',
                    message: `Congratulations! You leveled up to Level ${newLevel}! Keep engaging in campus life to earn more rewards.`,
                    type: 'SYSTEM'
                });
            }
            return { xp: newXP, level: newLevel, leveledUp };
        }
        catch (error) {
            console.error('Error awarding XP:', error);
            throw error;
        }
    }
}
exports.GamificationService = GamificationService;
