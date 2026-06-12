"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = getRecommendations;
exports.predictAttendance = predictAttendance;
exports.getSmartSchedule = getSmartSchedule;
exports.getEngagementStats = getEngagementStats;
const aiService_1 = require("../services/aiService");
async function getRecommendations(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const recs = await aiService_1.AIService.generateRecommendations(req.user);
        res.status(200).json(recs);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to fetch AI recommendations' });
    }
}
async function predictAttendance(req, res) {
    const { category, capacity, dayOfWeek } = req.query;
    try {
        const prediction = aiService_1.AIService.predictAttendance(category, Number(capacity || 100), dayOfWeek);
        res.status(200).json(prediction);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to calculate prediction' });
    }
}
async function getSmartSchedule(req, res) {
    try {
        const suggestions = await aiService_1.AIService.getSmartScheduleSuggestions();
        res.status(200).json(suggestions);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to calculate smart slots' });
    }
}
async function getEngagementStats(req, res) {
    try {
        const stats = await aiService_1.AIService.getEngagementStats();
        res.status(200).json(stats);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to retrieve stats' });
    }
}
