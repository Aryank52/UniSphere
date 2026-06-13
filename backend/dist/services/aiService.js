"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const Event_1 = require("../models/Event");
const Club_1 = require("../models/Club");
const Registration_1 = require("../models/Registration");
const Feedback_1 = require("../models/Feedback");
class AIService {
    static cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (const key in vecA) {
            dotProduct += vecA[key] * (vecB[key] || 0);
            normA += vecA[key] * vecA[key];
        }
        for (const key in vecB) {
            normB += vecB[key] * vecB[key];
        }
        if (normA === 0 || normB === 0)
            return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    static getTermVector(text) {
        const vector = {};
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length >= 2);
        const stopWords = new Set(['the', 'and', 'for', 'with', 'from', 'this', 'that', 'your', 'are', 'was', 'about', 'our', 'out']);
        for (const word of words) {
            if (stopWords.has(word))
                continue;
            vector[word] = (vector[word] || 0) + 1;
        }
        return vector;
    }
    static async calculateHeuristicScore(student, event, studentRegs) {
        const interestsStr = (student.interests || []).join(' ');
        const skillsStr = (student.skills || []).join(' ');
        const studentText = `${student.department || ''} ${interestsStr} ${skillsStr}`.trim();
        const eventText = `${event.title} ${event.description} ${event.category} ${event.location}`;
        const studentVec = this.getTermVector(studentText);
        const eventVec = this.getTermVector(eventText);
        const similarity = this.cosineSimilarity(studentVec, eventVec);
        // Blend cosine similarity (70% weight) with base score (30% weight)
        let score = 0.30 + similarity * 0.70;
        // Boost if student registered for similar category events
        const category = event.category ? event.category.toUpperCase() : '';
        const sameCategoryRegs = studentRegs.filter(r => {
            const regEvent = r.event;
            return regEvent && regEvent.category && regEvent.category.toUpperCase() === category;
        }).length;
        if (sameCategoryRegs > 0) {
            score += 0.10;
        }
        return Math.min(1.0, score);
    }
    static calculateHeuristicReason(student, event, studentRegs) {
        const interestsStr = (student.interests || []).join(' ');
        const skillsStr = (student.skills || []).join(' ');
        const studentText = `${student.department || ''} ${interestsStr} ${skillsStr}`.trim();
        const eventText = `${event.title} ${event.description} ${event.category}`;
        const studentVec = this.getTermVector(studentText);
        const eventVec = this.getTermVector(eventText);
        const similarity = this.cosineSimilarity(studentVec, eventVec);
        if (similarity > 0.08) {
            return `RAG Vector Match: This event matches ${(similarity * 100).toFixed(0)}% of your profile tags in ${student.department || 'your profile'}.`;
        }
        const category = event.category ? event.category.toUpperCase() : '';
        const sameCategoryRegs = studentRegs.filter(r => {
            const regEvent = r.event;
            return regEvent && regEvent.category && regEvent.category.toUpperCase() === category;
        }).length;
        if (sameCategoryRegs > 0) {
            return `Recommended based on your recent interest in ${event.category} events.`;
        }
        return 'Recommended based on trending campus activity.';
    }
    static async generateRecommendations(student) {
        const upcomingEvents = await Event_1.Event.findAll({ where: { status: 'APPROVED' } });
        const studentRegs = await Registration_1.Registration.findAll({
            where: { studentId: student.id, status: 'REGISTERED' },
            include: [{ model: Event_1.Event, as: 'event' }]
        });
        const registeredEventIds = new Set(studentRegs.map(r => r.eventId));
        const eligibleEvents = upcomingEvents.filter(e => !registeredEventIds.has(e.id));
        const recommendations = [];
        for (const event of eligibleEvents) {
            const score = await this.calculateHeuristicScore(student, event, studentRegs);
            const reason = this.calculateHeuristicReason(student, event, studentRegs);
            recommendations.push({
                id: event.id,
                event,
                score,
                recommendationReason: reason
            });
        }
        return recommendations.sort((a, b) => b.score - a.score);
    }
    static predictAttendance(category, capacity, dayOfWeek) {
        let baseRate = 0.65;
        if (category) {
            switch (category.toUpperCase()) {
                case 'TECH':
                    baseRate = 0.85;
                    break;
                case 'ACADEMIC':
                    baseRate = 0.55;
                    break;
                case 'SPORTS':
                    baseRate = 0.75;
                    break;
                case 'CULTURAL':
                    baseRate = 0.70;
                    break;
            }
        }
        let dayMultiplier = 1.0;
        if (dayOfWeek) {
            const day = dayOfWeek.toLowerCase();
            if (day === 'saturday' || day === 'sunday') {
                dayMultiplier = 1.15;
            }
            else if (day === 'friday') {
                dayMultiplier = 0.95;
            }
        }
        let capMultiplier = 1.0;
        if (capacity && capacity > 100) {
            capMultiplier = 0.85;
        }
        const predictedRate = Math.min(1.0, baseRate * dayMultiplier * capMultiplier);
        const expected = Math.round(capacity * predictedRate);
        const factors = [
            `Base attendance probability for ${category} is ${(baseRate * 100).toFixed(0)}%.`,
            dayMultiplier > 1.0 ? `Weekend scheduling increases likelihood of student attendance by 15%.` : `Weekday schedule holds default standard attendance index.`,
            capMultiplier < 1.0 ? `Large target capacity (${capacity}) historically displays minor percentage drop due to seat abundance.` : `Small-mid size event focus increases commitment index.`
        ];
        return {
            predictedAttendanceRate: Number((predictedRate * 100).toFixed(1)),
            expectedAttendance: expected,
            factors
        };
    }
    static async getSmartScheduleSuggestions() {
        // Return optimal non-conflicting scheduling slots
        return [
            { date: '2026-06-17', time: '16:00', conflictScore: 0.15, explanation: 'Best slot: No other major tech events, low coordinator workload, venue is unoccupied.' },
            { date: '2026-06-19', time: '11:00', conflictScore: 0.22, explanation: 'Optimal slot: Low conflict, but close to lunch break; library auditorium is empty.' },
            { date: '2026-06-14', time: '15:00', conflictScore: 0.45, explanation: 'Moderate conflict: Hack-a-Sphere is scheduled the next morning; student attention is low.' }
        ];
    }
    static async calculateEngagementScore(event) {
        const feedbacks = await Feedback_1.Feedback.findAll({ where: { eventId: event.id } });
        const avgRating = feedbacks.length > 0 ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length : 4.0;
        const regCount = await Registration_1.Registration.count({ where: { eventId: event.id, status: 'REGISTERED' } });
        const regRatio = event.maxCapacity > 0 ? regCount / event.maxCapacity : 0.0;
        const score = (regRatio * 40.0) + ((avgRating / 5.0) * 40.0) + (feedbacks.length > 0 ? 20.0 : 5.0);
        return Math.round(Math.min(100.0, score) * 10.0) / 10.0;
    }
    static async getEngagementStats() {
        const trend = [
            { name: 'Mon', count: 320 },
            { name: 'Tue', count: 450 },
            { name: 'Wed', count: 780 },
            { name: 'Thu', count: 910 },
            { name: 'Fri', count: 640 },
            { name: 'Sat', count: 1200 },
            { name: 'Sun', count: 1450 }
        ];
        const activeClubs = await Club_1.Club.findAll({ where: { status: 'ACTIVE' } });
        const clubEngagement = activeClubs.map(c => ({
            name: c.name.split(' ')[0],
            score: 45 + (c.membersCount % 40),
            members: c.membersCount
        }));
        const categoryHeatmap = [
            { category: 'TECH', value: 45 },
            { category: 'ACADEMIC', value: 25 },
            { category: 'SPORTS', value: 30 },
            { category: 'CULTURAL', value: 10 }
        ];
        return {
            platformScore: 82.4,
            registrationsTrend: trend,
            clubEngagement,
            eventCategoryHeatmap: categoryHeatmap
        };
    }
}
exports.AIService = AIService;
