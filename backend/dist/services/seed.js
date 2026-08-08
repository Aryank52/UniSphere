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
const Venue_1 = require("../models/Venue");
const Achievement_1 = require("../models/Achievement");
const ClubMember_1 = require("../models/ClubMember");
async function seedDatabase() {
    const deanExists = await User_1.User.findOne({ where: { email: 'vijaysekhar@upes.ac.in' } });
    if (deanExists) {
        console.log('UPES Dehradun Faculty & Student Roster already present in database.');
        return;
    }
    console.log('Seeding UPES Dehradun Faculty & Student Campus Operating System data...');
    // Clear previous sample data if updating schema
    await Attendance_1.Attendance.destroy({ where: {} });
    await Registration_1.Registration.destroy({ where: {} });
    await ClubMember_1.ClubMember.destroy({ where: {} });
    await Event_1.Event.destroy({ where: {} });
    await Club_1.Club.destroy({ where: {} });
    await User_1.User.destroy({ where: {} });
    await Venue_1.Venue.destroy({ where: {} });
    await Achievement_1.Achievement.destroy({ where: {} });
    const hashedPassword = await bcryptjs_1.default.hash('password', 10);
    // 1. Create Venues
    const mainAuditorium = await Venue_1.Venue.create({
        name: 'Main Auditorium (Bidholi)',
        locationDetails: 'Energy Acres Block, Bidholi Campus, UPES Dehradun',
        latitude: 30.3412,
        longitude: 77.9548,
        capacity: 500
    });
    const csAuditorium = await Venue_1.Venue.create({
        name: 'CS Block A Auditorium',
        locationDetails: 'School of Computer Science, Bidholi Campus',
        latitude: 30.3415,
        longitude: 77.9551,
        capacity: 150
    });
    const centralQuad = await Venue_1.Venue.create({
        name: 'Bidholi Quadrangle',
        locationDetails: 'Central Lawn, Bidholi Campus, UPES Dehradun',
        latitude: 30.3409,
        longitude: 77.9542,
        capacity: 800
    });
    const aiLab = await Venue_1.Venue.create({
        name: 'Advanced AI Research Lab',
        locationDetails: 'High-Tech Lab Wing, Bidholi Campus',
        latitude: 30.3416,
        longitude: 77.9554,
        capacity: 40
    });
    // 2. Create Achievements
    await Achievement_1.Achievement.create({
        title: 'UPES Hackathon Master',
        description: 'Register and check in at a major campus hackathon at UPES.',
        badgeImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100',
        xpBonus: 100
    });
    await Achievement_1.Achievement.create({
        title: 'Knowledge Seeker',
        description: 'Attend 3 or more academic seminars led by UPES Faculty.',
        badgeImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100',
        xpBonus: 50
    });
    // 3. Seed Default Admin, Faculty, and Student accounts for Quick Login
    const defaultStudent = await User_1.User.create({
        name: 'Kartik (Student Lead)',
        email: 'student@unisphere.edu',
        password: hashedPassword,
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        academicYear: 4,
        interests: ['coding', 'artificial intelligence', 'hackathons', 'machine learning'],
        skills: ['React', 'TypeScript', 'Python', 'Java'],
        preferredCategories: ['TECH', 'ACADEMIC'],
        xpPoints: 450,
        level: 4,
        isEmailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
    const defaultFaculty = await User_1.User.create({
        name: 'Dr. Hitesh Kumar Sharma',
        email: 'faculty@unisphere.edu',
        password: hashedPassword,
        role: 'FACULTY',
        department: 'School of Computer Science',
        interests: ['AI', 'Deep Learning', 'Blockchain'],
        isEmailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });
    const defaultAdmin = await User_1.User.create({
        name: 'Admin Chief',
        email: 'admin@unisphere.edu',
        password: hashedPassword,
        role: 'ADMIN',
        department: 'UPES Administration',
        isEmailVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    // 4. Seed REAL UPES Faculty Members (25 Faculty Members)
    const facultyData = [
        {
            name: 'Prof. Vijaysekhar Chellaboina',
            designation: 'Professor and Dean',
            department: 'School of Computer Science',
            interests: ['Systems Theory', 'Control Systems', 'Optimization', 'Academic Leadership'],
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        },
        {
            name: 'Dr. Vinod Patidar',
            designation: 'Professor',
            department: 'School of Computer Science',
            interests: ['Chaos Theory', 'Nonlinear Dynamics', 'Cryptography'],
            profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
        },
        {
            name: 'Dr. Hitesh Kumar Sharma',
            designation: 'Professor - AI, Deep Learning, Blockchain',
            department: 'School of Computer Science',
            interests: ['AI', 'Deep Learning', 'Blockchain Technologies'],
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        },
        {
            name: 'Prof. (Dr.) Sanjay Biswash',
            designation: 'Professor - Cloud, Fog & Edge Computing',
            department: 'School of Computer Science',
            interests: ['Cloud Computing', 'Fog Computing', 'Edge Architectures'],
            profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
        },
        {
            name: 'Dr. Vijendra Singh',
            designation: 'Professor - Machine Learning, Big Data Analytics',
            department: 'School of Computer Science',
            interests: ['Machine Learning', 'Big Data Analytics', 'Pattern Recognition'],
            profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
        },
        {
            name: 'Prof. Adarsh Kumar',
            designation: 'Professor - Cybersecurity, Cryptography, Blockchain',
            department: 'School of Computer Science',
            interests: ['Cybersecurity', 'Cryptography', 'Distributed Ledgers'],
            profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'
        },
        {
            name: 'Dr. Md. Shamsul Haque Ansari',
            designation: 'Faculty - Database Technologies, Big Data',
            department: 'Computer Science & Data Engineering',
            interests: ['Database Technologies', 'Big Data', 'Distributed Query Optimization'],
            profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        },
        {
            name: 'Dr. Kaushik Ghosh',
            designation: 'Faculty - Wireless Sensor Networks, IoT',
            department: 'Computer Science & IoT',
            interests: ['Wireless Sensor Networks', 'IoT Architectures', 'Embedded Protocols'],
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        },
        {
            name: 'Dr. Subhrasankar Chatterjee',
            designation: 'Assistant Professor Senior Scale - Computational Neuroscience, Transformer Architectures',
            department: 'Computer Science & AI',
            interests: ['Computational Neuroscience', 'Transformer Architectures', 'Deep Learning'],
            profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
        },
        {
            name: 'Dr. Saurabh Shrivastava',
            designation: 'Assistant Professor Senior Scale - Optimization-based ML, Java',
            department: 'School of Computer Science',
            interests: ['Optimization-based ML', 'Java Enterprise Systems', 'Algorithms'],
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        },
        {
            name: 'Dr. Siva Sankar',
            designation: 'Assistant Professor Selection Grade - Geospatial Intelligence, Spatial Data Science',
            department: 'Computer Science & Spatial Computing',
            interests: ['Geospatial Intelligence', 'Spatial Data Science', 'Remote Analytics'],
            profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
        },
        {
            name: 'Dr. Khushboo Jain',
            designation: 'Assistant Professor - Data Structures, Algorithms, Data Mining',
            department: 'School of Computer Science',
            interests: ['Data Structures', 'Algorithms', 'Data Mining'],
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        },
        {
            name: 'Dr. Uday Kumar Murali',
            designation: 'Assistant Professor - Operations Research, Statistical Analytics',
            department: 'Data Analytics & Decision Sciences',
            interests: ['Operations Research', 'Statistical Analytics', 'Predictive Modeling'],
            profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
        },
        {
            name: 'Dr. Swadhin Das',
            designation: 'Assistant Professor - NLP, Computer Vision, Image Processing',
            department: 'Computer Science & Vision AI',
            interests: ['NLP', 'Computer Vision', 'Image Processing'],
            profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'
        },
        {
            name: 'Dr. Nutan Singh',
            designation: 'Faculty - AI-driven Healthcare, Deep Learning Applications',
            department: 'Computer Science & Bio-IT',
            interests: ['AI-driven Healthcare', 'Deep Learning Applications', 'Medical Imaging'],
            profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        },
        {
            name: 'Dr. Vishal Sharma',
            designation: 'Faculty - Remote Sensing, SAR Image Processing',
            department: 'Geoinformatics & Sensing',
            interests: ['Remote Sensing', 'SAR Image Processing', 'Satellite Data Analytics'],
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        },
        {
            name: 'Dr. Christalin Nelson S',
            designation: 'Faculty - Object Oriented Programming, Data Structures',
            department: 'School of Computer Science',
            interests: ['Object Oriented Programming', 'Data Structures', 'C++ Systems'],
            profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
        },
        {
            name: 'Prof. Abhishek Yadav',
            designation: 'Assistant Professor - Cyber Security, Digital Forensics',
            department: 'Cyber Security',
            interests: ['Cyber Security', 'Digital Forensics', 'Incident Response'],
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        },
        {
            name: 'Mr. Santanu Ghosh',
            designation: 'Assistant Professor - Quantum & Edge Computing',
            department: 'School of Computer Science',
            interests: ['Quantum Computing', 'Edge Architectures', 'Qiskit Frameworks'],
            profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
        },
        {
            name: 'Mr. Himanshu',
            designation: 'Assistant Professor - Wireless Communication, Data Analysis Systems',
            department: 'Telecommunication & Networks',
            interests: ['Wireless Communication', 'Data Analysis Systems', '5G Networks'],
            profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
        },
        {
            name: 'Dr. Ravi S Iyer',
            designation: 'Faculty - Graduate of IIT Madras / IISc',
            department: 'School of Computer Science',
            interests: ['Theoretical Computer Science', 'High Performance Computing', 'Algorithms'],
            profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'
        },
        {
            name: 'Mr. Anil Kumar',
            designation: 'Faculty member',
            department: 'School of Computer Science',
            interests: ['Software Engineering', 'Web Technologies', 'Cloud Services'],
            profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        },
        {
            name: 'Dr. Ashutosh Kumar Dikshit',
            designation: 'Assistant Professor Selection Grade',
            department: 'School of Computer Science',
            interests: ['Network Security', 'Information Systems', 'Cryptography'],
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        },
        {
            name: 'Dr. Mukesh Kumar Sharma',
            designation: 'Associate Professor',
            department: 'Computer Science & Data Analytics',
            interests: ['Cloud Security', 'Soft Computing', 'Neural Networks'],
            profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
        },
        {
            name: 'Dr. Alind',
            designation: 'Faculty member',
            department: 'School of Computer Science',
            interests: ['Operating Systems', 'Embedded Systems', 'Kernel Architecture'],
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        }
    ];
    const seededFaculty = [defaultFaculty];
    for (let i = 0; i < facultyData.length; i++) {
        const f = facultyData[i];
        const emailPrefix = f.name.toLowerCase().replace(/[^a-z]/g, '.');
        const seededF = await User_1.User.create({
            name: f.name,
            email: `${emailPrefix}@upes.ac.in`,
            password: hashedPassword,
            role: 'FACULTY',
            department: f.department,
            interests: f.interests,
            skills: [f.designation],
            isEmailVerified: true,
            profileImage: f.profileImage
        });
        seededFaculty.push(seededF);
    }
    // 5. Seed REAL UPES Student Names (64 UPES Students)
    const studentNamesList = [
        'kartik', 'ayush', 'aryan', 'aditya', 'vansh', 'bhavendra', 'shaurya', 'krish', 'princy', 'gauri',
        'vedika', 'ishika', 'shreya', 'yash', 'aman', 'akshay', 'bhaskar', 'saumya', 'deepak', 'swastika',
        'arnav', 'uday', 'yugal', 'priyanshu', 'parimal', 'sara', 'prince', 'jiya', 'naina', 'prakash',
        'priyanka', 'ishaan', 'mridul', 'dhurv', 'kirti', 'arya', 'sachin', 'sheryam', 'anmol', 'bhavya',
        'pari', 'om', 'anuj', 'sahil', 'vanshika', 'anika', 'anubhava', 'vrishali', 'khushboo', 'kavya',
        'tanya', 'akshat', 'muskan', 'sarthak', 'shivam', 'vikram', 'saurabh', 'shrishti', 'rashmi', 'rishi',
        'trishika', 'khushi', 'aditi', 'rahul'
    ];
    const depts = [
        'Computer Science & Engineering', 'Data Science & Artificial Intelligence',
        'Cyber Security & Digital Forensics', 'Cloud Computing & DevOps', 'IoT & Robotics'
    ];
    const seededStudents = [defaultStudent];
    for (let i = 0; i < studentNamesList.length; i++) {
        const rawName = studentNamesList[i];
        const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const email = `${rawName.toLowerCase()}@stu.upes.ac.in`;
        const dept = depts[i % depts.length];
        const year = (i % 4) + 1;
        const xp = 100 + (i * 15) % 450;
        const level = Math.floor(xp / 100) + 1;
        const st = await User_1.User.create({
            name: `${capitalizedName} (UPES Student)`,
            email,
            password: hashedPassword,
            role: 'STUDENT',
            department: dept,
            academicYear: year,
            interests: ['coding', 'hackathons', 'AI', 'web development', 'cybersecurity'],
            skills: ['Python', 'JavaScript', 'C++', 'SQL'],
            preferredCategories: ['TECH', 'ACADEMIC', 'SPORTS'],
            xpPoints: xp,
            level,
            isEmailVerified: true,
            profileImage: `https://images.unsplash.com/photo-${1530000000000 + i * 1000}?w=150`
        });
        seededStudents.push(st);
    }
    // 6. Create Clubs managed by UPES Faculty
    const acm = await Club_1.Club.create({
        name: 'UPES ACM Student Chapter',
        description: 'Deep dive into algorithmic challenges, hackathons, and software engineering principles at UPES Dehradun.',
        bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        creatorId: seededFaculty[3].id, // Dr. Hitesh Kumar Sharma
        membersCount: 1420,
        status: 'ACTIVE'
    });
    const ieee = await Club_1.Club.create({
        name: 'UPES IEEE Student Branch',
        description: 'Promoting technical innovation and excellence in engineering, science, and computing at UPES Dehradun.',
        bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        creatorId: seededFaculty[1].id, // Prof. Vijaysekhar Chellaboina
        membersCount: 980,
        status: 'ACTIVE'
    });
    const sports = await Club_1.Club.create({
        name: 'UPES Sports Committee',
        description: 'Hosting intramural sporting leagues, athletic meets, and Spandan sports events at Bidholi campus.',
        bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        creatorId: seededFaculty[5].id, // Dr. Vijendra Singh
        membersCount: 1120,
        status: 'ACTIVE'
    });
    // 7. Add Club Members
    for (let i = 0; i < 20; i++) {
        await ClubMember_1.ClubMember.create({ clubId: acm.id, userId: seededStudents[i].id });
        await ClubMember_1.ClubMember.create({ clubId: ieee.id, userId: seededStudents[i + 10].id });
        await ClubMember_1.ClubMember.create({ clubId: sports.id, userId: seededStudents[i + 20].id });
    }
    // 8. Create Campus Events co-ordinated by REAL UPES Faculty
    const event1 = await Event_1.Event.create({
        title: 'UPES ACM Hack-a-Sphere 2026',
        description: 'The ultimate 24-hour campus hackathon at UPES Bidholi led by Dr. Hitesh Kumar Sharma & Dr. Khushboo Jain! Build solutions for sustainability, AI, or healthcare.',
        date: '2026-06-15',
        time: '09:00',
        location: mainAuditorium.name,
        venueId: mainAuditorium.id,
        campus: 'Bidholi',
        maxCapacity: 500,
        status: 'APPROVED',
        bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        category: 'TECH',
        clubId: acm.id,
        coordinatorId: seededFaculty[3].id,
        engagementScore: 95.8
    });
    const event2 = await Event_1.Event.create({
        title: 'UPES Deep Learning & Transformer Summit',
        description: 'An interactive research symposium hosted by Dr. Subhrasankar Chatterjee & Dr. Swadhin Das discussing Transformer Architectures and Generative AI.',
        date: '2026-06-20',
        time: '14:00',
        location: csAuditorium.name,
        venueId: csAuditorium.id,
        campus: 'Bidholi',
        maxCapacity: 150,
        status: 'APPROVED',
        bannerImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800',
        category: 'ACADEMIC',
        clubId: ieee.id,
        coordinatorId: seededFaculty[9].id, // Dr. Subhrasankar Chatterjee
        engagementScore: 88.4
    });
    const event3 = await Event_1.Event.create({
        title: 'UPES Cyber Security & Forensics Workshop',
        description: 'Hands-on penetration testing and digital forensics lab led by Prof. Adarsh Kumar & Prof. Abhishek Yadav at UPES High-Tech Wing.',
        date: '2026-06-22',
        time: '11:00',
        location: aiLab.name,
        venueId: aiLab.id,
        campus: 'Bidholi',
        maxCapacity: 100,
        status: 'APPROVED',
        bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        category: 'TECH',
        clubId: ieee.id,
        coordinatorId: seededFaculty[6].id, // Prof. Adarsh Kumar
        engagementScore: 91.2
    });
    const event4 = await Event_1.Event.create({
        title: 'UPES Spandan Annual Track & Sports Meet',
        description: 'Intramural athletic meets and cricket/football selections organized by UPES Sports Committee at Bidholi Quadrangle.',
        date: '2026-06-28',
        time: '08:00',
        location: centralQuad.name,
        venueId: centralQuad.id,
        campus: 'Bidholi',
        maxCapacity: 800,
        status: 'APPROVED',
        bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        category: 'SPORTS',
        clubId: sports.id,
        coordinatorId: seededFaculty[5].id,
        engagementScore: 79.5
    });
    // 9. Seed Student Registrations & Attendance for UPES Students
    for (let i = 0; i < seededStudents.length; i++) {
        const s = seededStudents[i];
        if (i < 35) {
            await Registration_1.Registration.create({
                eventId: event1.id,
                studentId: s.id,
                status: 'REGISTERED',
                passCode: `PASS-${event1.id}-${100400 + i * 13}`
            });
        }
        if (i >= 15 && i < 45) {
            await Registration_1.Registration.create({
                eventId: event2.id,
                studentId: s.id,
                status: 'REGISTERED',
                passCode: `PASS-${event2.id}-${990400 + i * 19}`
            });
        }
        if (i < 20) {
            await Attendance_1.Attendance.create({
                eventId: event3.id,
                studentId: s.id,
                checkedById: seededFaculty[6].id
            });
        }
    }
    console.log(`UPES Campus Operating System populated successfully with ${seededFaculty.length} Faculty Members and ${seededStudents.length} Students!`);
}
