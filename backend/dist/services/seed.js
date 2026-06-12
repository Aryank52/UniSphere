"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Club_1 = require("../models/Club");
const Event_1 = require("../models/Event");
const Registration_1 = require("../models/Registration");
const Attendance_1 = require("../models/Attendance");
async function seedDatabase() {
    const userCount = await User_1.User.count();
    if (userCount > 0) {
        return;
    }
    console.log('Seeding initial campus data (10x boosted metrics)...');
    const hashedPassword = await bcryptjs_1.default.hash('password', 10);
    // 1. Create Users
    const student = await User_1.User.create({
        name: 'Alex Rivera',
        email: 'student@unisphere.edu',
        password: hashedPassword,
        role: 'STUDENT',
        department: 'Computer Science',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
    const faculty = await User_1.User.create({
        name: 'Dr. Sarah Jenkins',
        email: 'faculty@unisphere.edu',
        password: hashedPassword,
        role: 'FACULTY',
        department: 'Data Science',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });
    const admin = await User_1.User.create({
        name: 'Admin Chief',
        email: 'admin@unisphere.edu',
        password: hashedPassword,
        role: 'ADMIN',
        department: 'Administration',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    // 2. Create Clubs
    const acm = await Club_1.Club.create({
        name: 'UPES ACM Student Chapter',
        description: 'Deep dive into algorithmic challenges, hackathons, and software engineering principles at UPES.',
        bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        creatorId: faculty.id,
        membersCount: 1420,
        status: 'ACTIVE'
    });
    const ieee = await Club_1.Club.create({
        name: 'UPES IEEE Student Branch',
        description: 'Promoting technical innovation and excellence in engineering, science, and computing at UPES Dehradun.',
        bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        creatorId: faculty.id,
        membersCount: 980,
        status: 'ACTIVE'
    });
    const nss = await Club_1.Club.create({
        name: 'UPES NSS Chapter',
        description: 'National Service Scheme unit at UPES, focusing on rural development, blood donation drives, and sustainability campaigns.',
        bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        creatorId: faculty.id,
        membersCount: 640,
        status: 'ACTIVE'
    });
    const uurja = await Club_1.Club.create({
        name: 'UPES Uurja Cultural Club',
        description: 'The premier cultural hub of UPES showcasing music, dance, theatre, and visual arts competitions.',
        bannerImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
        creatorId: faculty.id,
        membersCount: 420,
        status: 'ACTIVE'
    });
    const mtc = await Club_1.Club.create({
        name: 'UPES Microsoft Technical Community',
        description: 'Fostering industry readiness and hands-on coding in Microsoft technologies and cloud services at UPES.',
        bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        creatorId: faculty.id,
        membersCount: 880,
        status: 'ACTIVE'
    });
    const sports = await Club_1.Club.create({
        name: 'UPES Sports Committee',
        description: 'Hosting intramural sporting leagues, athletic meets, and Spandan sports events at Bidholi campus.',
        bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        creatorId: faculty.id,
        membersCount: 1120,
        status: 'ACTIVE'
    });
    // 3. Create Events
    const event1 = await Event_1.Event.create({
        title: 'UPES ACM Hack-a-Sphere 2026',
        description: 'The ultimate 24-hour campus hackathon at UPES Bidholi! Build solutions for sustainability, education, or healthcare. Win exciting prizes and placement interviews.',
        date: '2026-06-15',
        time: '09:00',
        location: 'Main Auditorium, Bidholi Campus',
        campus: 'Bidholi',
        maxCapacity: 500,
        status: 'APPROVED',
        bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        category: 'TECH',
        clubId: acm.id,
        coordinatorId: faculty.id,
        engagementScore: 92.5
    });
    const event2 = await Event_1.Event.create({
        title: 'UPES AI Innovations Summit',
        description: 'An interactive seminar hosted by IEEE UPES discussing the socioeconomic impacts of generative AI models, deepfakes, and automated campus grading systems.',
        date: '2026-06-20',
        time: '14:00',
        location: 'Energy Acres Block Hall A, Bidholi',
        campus: 'Bidholi',
        maxCapacity: 350,
        status: 'APPROVED',
        bannerImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800',
        category: 'ACADEMIC',
        clubId: ieee.id,
        coordinatorId: faculty.id,
        engagementScore: 78.0
    });
    const event3 = await Event_1.Event.create({
        title: 'UPES NSS Cleanliness & Greenery Drive',
        description: 'Help NSS UPES collect plastic waste and set up recycling hubs near the Bidholi student dormitories. T-shirts and refreshments provided to volunteers!',
        date: '2026-06-12',
        time: '08:00',
        location: 'Bidholi Campus Quadrangle',
        campus: 'Bidholi',
        maxCapacity: 150,
        status: 'APPROVED',
        bannerImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
        category: 'SPORTS',
        clubId: nss.id,
        coordinatorId: faculty.id,
        engagementScore: 65.2
    });
    const event4 = await Event_1.Event.create({
        title: 'UPES ACM Quantum Computing Seminar',
        description: 'An advanced seminar detailing qubits, superposition, and quantum cryptographic algorithms. Recommended for CS & Engineering students.',
        date: '2026-06-28',
        time: '16:00',
        location: 'CS Block Room 101, Bidholi',
        campus: 'Bidholi',
        maxCapacity: 100,
        status: 'PENDING',
        bannerImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        category: 'TECH',
        clubId: acm.id,
        coordinatorId: faculty.id,
        engagementScore: 0.0
    });
    // Seeding some registrations for the student
    const pass1 = `PASS-${event1.id}-100432`;
    await Registration_1.Registration.create({
        eventId: event1.id,
        studentId: student.id,
        status: 'REGISTERED',
        passCode: pass1
    });
    const pass2 = `PASS-${event2.id}-990423`;
    await Registration_1.Registration.create({
        eventId: event2.id,
        studentId: student.id,
        status: 'REGISTERED',
        passCode: pass2
    });
    // Seed attendance for event 3
    await Attendance_1.Attendance.create({
        eventId: event3.id,
        studentId: student.id,
        checkedById: faculty.id
    });
    console.log('Seeding completed successfully.');
}
