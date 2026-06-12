"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.readNotification = readNotification;
const Notification_1 = require("../models/Notification");
async function getNotifications(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const notifs = await Notification_1.Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(notifs);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to retrieve notifications' });
    }
}
async function readNotification(req, res) {
    const { id } = req.params;
    try {
        const notif = await Notification_1.Notification.findByPk(id);
        if (!notif) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        notif.isRead = true;
        await notif.save();
        res.status(200).json({ message: 'Read success' });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to update notification' });
    }
}
