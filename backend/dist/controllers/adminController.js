"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingEvents = getPendingEvents;
exports.approveEvent = approveEvent;
exports.getPendingClubs = getPendingClubs;
exports.approveClub = approveClub;
exports.getUsersList = getUsersList;
const Event_1 = require("../models/Event");
const Club_1 = require("../models/Club");
const User_1 = require("../models/User");
const Notification_1 = require("../models/Notification");
const cache_1 = require("../config/cache");
async function clearEventsCache() {
    await (0, cache_1.invalidateCache)('events_list_ALL');
    await (0, cache_1.invalidateCache)('events_list_TECH');
    await (0, cache_1.invalidateCache)('events_list_SPORTS');
    await (0, cache_1.invalidateCache)('events_list_ACADEMIC');
    await (0, cache_1.invalidateCache)('events_list_CULTURAL');
}
async function getPendingEvents(req, res) {
    try {
        const events = await Event_1.Event.findAll({ where: { status: 'PENDING' } });
        res.status(200).json(events);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to fetch pending events' });
    }
}
async function approveEvent(req, res) {
    const { id } = req.params;
    const { approve } = req.query;
    try {
        const isApproved = approve === 'true';
        const event = await Event_1.Event.findByPk(id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        event.status = isApproved ? 'APPROVED' : 'REJECTED';
        await event.save();
        // Notify coordinator
        await Notification_1.Notification.create({
            userId: event.coordinatorId,
            title: isApproved ? 'Event Approved!' : 'Event Rejected',
            message: `Your event "${event.title}" has been ${isApproved ? 'approved' : 'rejected'} by admin.`,
            type: 'EVENT_APPROVAL'
        });
        await clearEventsCache();
        res.status(200).json({ message: 'Event status updated' });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to update event status' });
    }
}
async function getPendingClubs(req, res) {
    try {
        const clubs = await Club_1.Club.findAll({ where: { status: 'PENDING' } });
        res.status(200).json(clubs);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to fetch pending clubs' });
    }
}
async function approveClub(req, res) {
    const { id } = req.params;
    const { approve } = req.query;
    try {
        const isApproved = approve === 'true';
        const club = await Club_1.Club.findByPk(id);
        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }
        if (isApproved) {
            club.status = 'ACTIVE';
            await club.save();
        }
        else {
            await club.destroy();
        }
        res.status(200).json({ message: 'Club status updated' });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to update club status' });
    }
}
async function getUsersList(req, res) {
    try {
        const users = await User_1.User.findAll({ attributes: ['id', 'name', 'email', 'role', 'department', 'profileImage'] });
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to fetch users' });
    }
}
