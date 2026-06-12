"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventAttendees = getEventAttendees;
exports.checkInAttendance = checkInAttendance;
const Registration_1 = require("../models/Registration");
const Attendance_1 = require("../models/Attendance");
const User_1 = require("../models/User");
const Notification_1 = require("../models/Notification");
const Event_1 = require("../models/Event");
const notificationService_1 = require("../services/notificationService");
async function getEventAttendees(req, res) {
    const { eventId } = req.params;
    try {
        const registrations = await Registration_1.Registration.findAll({
            where: { eventId, status: 'REGISTERED' },
            include: [{ model: User_1.User, as: 'student', attributes: ['id', 'name', 'email', 'department'] }]
        });
        const attendances = await Attendance_1.Attendance.findAll({ where: { eventId } });
        const checkedInStudentIds = new Set(attendances.map(a => a.studentId));
        const attendeeList = registrations.map(r => {
            const student = r.student;
            const checkedIn = checkedInStudentIds.has(r.studentId);
            const attendRecord = attendances.find(a => a.studentId === r.studentId);
            return {
                studentId: r.studentId,
                name: student.name,
                email: student.email,
                department: student.department,
                checkedIn,
                checkedInAt: attendRecord ? attendRecord.checkedInAt : null,
                passCode: r.passCode
            };
        });
        res.status(200).json(attendeeList);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to fetch attendees checklist' });
    }
}
async function checkInAttendance(req, res) {
    const { eventId, passCode } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const reg = await Registration_1.Registration.findOne({ where: { eventId, passCode, status: 'REGISTERED' } });
        if (!reg) {
            res.status(400).json({ message: 'Invalid digital pass QR code for this event!' });
            return;
        }
        const alreadyChecked = await Attendance_1.Attendance.findOne({ where: { eventId, studentId: reg.studentId } });
        if (alreadyChecked) {
            res.status(400).json({ message: 'Student already checked in!' });
            return;
        }
        await Attendance_1.Attendance.create({
            eventId,
            studentId: reg.studentId,
            checkedById: req.user.id
        });
        const event = await Event_1.Event.findByPk(eventId);
        // Notify Student
        await Notification_1.Notification.create({
            userId: reg.studentId,
            title: 'Attendance Checked In',
            message: `Your attendance has been scanned for event: ${event ? event.title : eventId}`,
            type: 'REGISTRATION'
        });
        // Simulated email dispatch on scan check-in
        const studentUser = await User_1.User.findByPk(reg.studentId);
        if (studentUser) {
            await notificationService_1.NotificationService.sendEmailNotification(studentUser.email, studentUser.name, `UniSphere Boarding Scan Complete: ${event ? event.title : 'Event'}`, `Hello ${studentUser.name},\n\nYour digital pass QR code was successfully scanned for "${event ? event.title : 'Event'}". Your attendance is checked in!\n\nThank you,\nUniSphere Boarding Desk`);
        }
        res.status(200).json({ success: true, studentId: reg.studentId });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to check in' });
    }
}
