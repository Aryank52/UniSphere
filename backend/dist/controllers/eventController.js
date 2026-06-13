"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = getEvents;
exports.getCoordinatorEvents = getCoordinatorEvents;
exports.getMyRegistrations = getMyRegistrations;
exports.createEvent = createEvent;
exports.deleteEvent = deleteEvent;
exports.registerForEvent = registerForEvent;
exports.submitFeedback = submitFeedback;
const Event_1 = require("../models/Event");
const Club_1 = require("../models/Club");
const Registration_1 = require("../models/Registration");
const Feedback_1 = require("../models/Feedback");
const Notification_1 = require("../models/Notification");
const User_1 = require("../models/User");
const aiService_1 = require("../services/aiService");
const notificationService_1 = require("../services/notificationService");
const gamificationService_1 = require("../services/gamificationService");
const cache_1 = require("../config/cache");
async function clearEventsCache() {
    await (0, cache_1.invalidateCache)('events_list_ALL');
    await (0, cache_1.invalidateCache)('events_list_TECH');
    await (0, cache_1.invalidateCache)('events_list_SPORTS');
    await (0, cache_1.invalidateCache)('events_list_ACADEMIC');
    await (0, cache_1.invalidateCache)('events_list_CULTURAL');
}
async function getEvents(req, res) {
    const { category } = req.query;
    const cacheKey = `events_list_${category || 'ALL'}`;
    try {
        const cached = await (0, cache_1.getCachedData)(cacheKey);
        if (cached) {
            res.status(200).json(cached);
            return;
        }
        const whereClause = { status: 'APPROVED' };
        if (category && category !== 'ALL') {
            whereClause.category = category.toUpperCase();
        }
        const events = await Event_1.Event.findAll({ where: whereClause, include: [{ model: Club_1.Club, as: 'club' }] });
        await (0, cache_1.setCachedData)(cacheKey, events, 300); // cache for 5 mins
        res.status(200).json(events);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to retrieve events' });
    }
}
async function getCoordinatorEvents(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const events = await Event_1.Event.findAll({ where: { coordinatorId: req.user.id } });
        res.status(200).json(events);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to retrieve coordinator events' });
    }
}
async function getMyRegistrations(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const regs = await Registration_1.Registration.findAll({
            where: { studentId: req.user.id, status: 'REGISTERED' },
            include: [{ model: Event_1.Event, as: 'event', include: [{ model: Club_1.Club, as: 'club' }] }]
        });
        const registeredEvents = regs.map(r => {
            const e = r.event.toJSON();
            e.passCode = r.passCode;
            return e;
        });
        res.status(200).json(registeredEvents);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to retrieve registered events' });
    }
}
async function createEvent(req, res) {
    const { title, description, date, time, location, maxCapacity, category, clubId } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const club = await Club_1.Club.findByPk(clubId);
        if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
        }
        let campus = 'Bidholi';
        if (location) {
            const lowerLoc = location.toLowerCase();
            if (lowerLoc.includes('kandoli')) {
                campus = 'Kandoli';
            }
            else if (lowerLoc.includes('development') || lowerLoc.includes('dev')) {
                campus = 'Development';
            }
        }
        const categoryImages = {
            TECH: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
            SPORTS: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
            ACADEMIC: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
            CULTURAL: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
        };
        const newEvent = await Event_1.Event.create({
            title,
            description,
            date,
            time,
            location,
            campus,
            maxCapacity,
            status: 'PENDING',
            category: category.toUpperCase(),
            bannerImage: categoryImages[category.toUpperCase()] || categoryImages.TECH,
            clubId,
            coordinatorId: req.user.id,
            engagementScore: 0.0
        });
        await clearEventsCache();
        res.status(201).json(newEvent);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to create event' });
    }
}
async function deleteEvent(req, res) {
    const { id } = req.params;
    try {
        const event = await Event_1.Event.findByPk(id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        await event.destroy();
        await clearEventsCache();
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to delete event' });
    }
}
async function registerForEvent(req, res) {
    const { id } = req.params;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const event = await Event_1.Event.findByPk(id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        const activeRegsCount = await Registration_1.Registration.count({ where: { eventId: id, status: 'REGISTERED' } });
        if (activeRegsCount >= event.maxCapacity) {
            res.status(400).json({ message: 'Event has reached maximum capacity!' });
            return;
        }
        const alreadyRegistered = await Registration_1.Registration.findOne({ where: { eventId: id, studentId: req.user.id, status: 'REGISTERED' } });
        if (alreadyRegistered) {
            res.status(400).json({ message: 'You are already registered for this event!' });
            return;
        }
        const code = `PASS-${id}-${Math.floor(100000 + Math.random() * 900000)}`;
        const registration = await Registration_1.Registration.create({
            eventId: event.id,
            studentId: req.user.id,
            status: 'REGISTERED',
            passCode: code
        });
        // Notify student
        await Notification_1.Notification.create({
            userId: req.user.id,
            title: 'Registration Confirmed',
            message: `You have successfully registered for ${event.title}. Pass code: ${code}`,
            type: 'REGISTRATION'
        });
        // Call simulated SMTP email notification service
        const studentUser = await User_1.User.findByPk(req.user.id);
        if (studentUser) {
            await notificationService_1.NotificationService.sendEmail(studentUser.email, `UniSphere Confirmed Reservation: ${event.title}`, `<div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
          <h2 style="color: #10b981;">Registration Confirmed!</h2>
          <p>Hello ${studentUser.name},</p>
          <p>Your boarding pass QR code for <strong>"${event.title}"</strong> is confirmed!</p>
          <p><strong>Ticket Passcode:</strong> ${code}<br/>
          <strong>Location:</strong> ${event.location}<br/>
          <strong>Date & Time:</strong> ${event.date} at ${event.time}</p>
          <p>Thank you,<br/>UniSphere Campus Hub</p>
        </div>`);
        }
        res.status(201).json(registration);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to register' });
    }
}
async function submitFeedback(req, res) {
    const { id } = req.params;
    const { rating, comment } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const event = await Event_1.Event.findByPk(id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        await Feedback_1.Feedback.create({
            eventId: event.id,
            studentId: req.user.id,
            rating,
            comment
        });
        // Award 10 XP for leaving feedback
        await gamificationService_1.GamificationService.awardXP(req.user.id, 10, `Submitted feedback for event: ${event.title}`);
        // Recalculate engagement score
        const newScore = await aiService_1.AIService.calculateEngagementScore(event);
        event.engagementScore = newScore;
        await event.save();
        res.status(200).send();
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to submit feedback' });
    }
}
