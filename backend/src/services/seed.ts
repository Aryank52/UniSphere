import bcrypt from 'bcryptjs'
import { User } from '../models/User'
import { Club } from '../models/Club'
import { Event } from '../models/Event'
import { Registration } from '../models/Registration'
import { Attendance } from '../models/Attendance'
import { Venue } from '../models/Venue'
import { Achievement } from '../models/Achievement'
import { ClubMember } from '../models/ClubMember'

export async function seedDatabase() {
  const userCount = await User.count()
  if (userCount > 0) {
    return
  }

  console.log('Seeding initial campus operating system data...')

  const hashedPassword = await bcrypt.hash('password', 10)

  // 1. Create Venues
  const mainAuditorium = await Venue.create({
    name: 'Main Auditorium (Bidholi)',
    locationDetails: 'Energy Acres Block, Bidholi Campus',
    latitude: 30.3412,
    longitude: 77.9548,
    capacity: 500
  })

  const csAuditorium = await Venue.create({
    name: 'CS Block A Auditorium',
    locationDetails: 'CS Block, Bidholi Campus',
    latitude: 30.3415,
    longitude: 77.9551,
    capacity: 150
  })

  const centralQuad = await Venue.create({
    name: 'Bidholi Quadrangle',
    locationDetails: 'Central Lawn, Bidholi Campus',
    latitude: 30.3409,
    longitude: 77.9542,
    capacity: 800
  })

  const aiLab = await Venue.create({
    name: 'Advanced AI Research Lab',
    locationDetails: 'High-Tech Lab Wing, Bidholi Campus',
    latitude: 30.3416,
    longitude: 77.9554,
    capacity: 40
  })

  // 2. Create Achievements
  const hackMaster = await Achievement.create({
    title: 'Hackathon Master',
    description: 'Register and check in at a major campus hackathon.',
    badgeImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100',
    xpBonus: 100
  })

  const knowledgeSeeker = await Achievement.create({
    title: 'Knowledge Seeker',
    description: 'Attend 3 or more academic seminars.',
    badgeImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100',
    xpBonus: 50
  })

  const communityLeader = await Achievement.create({
    title: 'Eco Warrior',
    description: 'Participate in volunteer or community service events.',
    badgeImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100',
    xpBonus: 80
  })

  // 3. Create Users with interests, onboarding completed, level/XP
  const student = await User.create({
    name: 'Alex Rivera',
    email: 'student@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Computer Science',
    academicYear: 4,
    interests: ['coding', 'artificial intelligence', 'hackathons', 'ux design', 'algorithms'],
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    preferredCategories: ['TECH', 'ACADEMIC'],
    xpPoints: 340,
    level: 3,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  })

  const faculty = await User.create({
    name: 'Dr. Sarah Jenkins',
    email: 'faculty@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Data Science',
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  })

  const coordinator = await User.create({
    name: 'ACM Coordinator',
    email: 'coordinator@unisphere.edu',
    password: hashedPassword,
    role: 'COORDINATOR',
    department: 'Computer Science',
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  })

  const admin = await User.create({
    name: 'Admin Chief',
    email: 'admin@unisphere.edu',
    password: hashedPassword,
    role: 'ADMIN',
    department: 'Administration',
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  })

  // Additional Faculty
  const f1 = await User.create({
    name: 'Prof. Vijaysekhar Chellaboina',
    email: 'vijaysekhar@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  })

  const f2 = await User.create({
    name: 'Prof. Neelu Jyothi Ahuja',
    email: 'neelu@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  })

  // Additional Students
  const s1 = await User.create({
    name: 'Aarav Sharma',
    email: 'aarav@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Computer Science',
    academicYear: 3,
    interests: ['coding', 'web development', 'sports', 'football'],
    skills: ['Javascript', 'HTML', 'Java'],
    preferredCategories: ['TECH', 'SPORTS'],
    xpPoints: 120,
    level: 1,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
  })

  const s2 = await User.create({
    name: 'Ananya Iyer',
    email: 'ananya@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Data Science',
    academicYear: 2,
    interests: ['analytics', 'statistics', 'music', 'dance'],
    skills: ['SQL', 'R', 'Excel'],
    preferredCategories: ['ACADEMIC', 'CULTURAL'],
    xpPoints: 210,
    level: 2,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  })

  const s3 = await User.create({
    name: 'Rohan Verma',
    email: 'rohan@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Computer Science',
    academicYear: 4,
    interests: ['cloud computing', 'devops', 'cybersecurity'],
    skills: ['AWS', 'Docker', 'Linux'],
    preferredCategories: ['TECH'],
    xpPoints: 90,
    level: 1,
    isEmailVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  })

  // 4. Create Clubs
  const acm = await Club.create({
    name: 'UPES ACM Student Chapter',
    description: 'Deep dive into algorithmic challenges, hackathons, and software engineering principles at UPES.',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    creatorId: f2.id,
    membersCount: 1420,
    status: 'ACTIVE'
  })

  const ieee = await Club.create({
    name: 'UPES IEEE Student Branch',
    description: 'Promoting technical innovation and excellence in engineering, science, and computing at UPES Dehradun.',
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    creatorId: faculty.id,
    membersCount: 980,
    status: 'ACTIVE'
  })

  const sports = await Club.create({
    name: 'UPES Sports Committee',
    description: 'Hosting intramural sporting leagues, athletic meets, and Spandan sports events at Bidholi campus.',
    bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    creatorId: coordinator.id,
    membersCount: 1120,
    status: 'ACTIVE'
  })

  // 5. Create Club Memberships
  await ClubMember.create({ clubId: acm.id, userId: student.id })
  await ClubMember.create({ clubId: ieee.id, userId: student.id })
  await ClubMember.create({ clubId: acm.id, userId: s1.id })
  await ClubMember.create({ clubId: sports.id, userId: s1.id })
  await ClubMember.create({ clubId: ieee.id, userId: s2.id })

  // 6. Create Events linked to Venues
  const event1 = await Event.create({
    title: 'UPES ACM Hack-a-Sphere 2026',
    description: 'The ultimate 24-hour campus hackathon at UPES Bidholi! Build solutions for sustainability, education, or healthcare. Win exciting prizes and placement interviews.',
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
    coordinatorId: coordinator.id,
    engagementScore: 92.5
  })

  const event2 = await Event.create({
    title: 'UPES AI Innovations Summit',
    description: 'An interactive seminar hosted by IEEE UPES discussing the socioeconomic impacts of generative AI models, deepfakes, and automated campus grading systems.',
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
    coordinatorId: faculty.id,
    engagementScore: 78.0
  })

  const event3 = await Event.create({
    title: 'UPES Sports tryouts & track match',
    description: 'Come and show off your athletic capabilities. Intramural selections are open for football and cricket teams.',
    date: '2026-06-12',
    time: '08:00',
    location: centralQuad.name,
    venueId: centralQuad.id,
    campus: 'Bidholi',
    maxCapacity: 800,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    category: 'SPORTS',
    clubId: sports.id,
    coordinatorId: coordinator.id,
    engagementScore: 65.2
  })

  const event4 = await Event.create({
    title: 'UPES ACM Quantum Computing Seminar',
    description: 'An advanced seminar detailing qubits, superposition, and quantum cryptographic algorithms. Recommended for CS & Engineering students.',
    date: '2026-06-28',
    time: '16:00',
    location: csAuditorium.name,
    venueId: csAuditorium.id,
    campus: 'Bidholi',
    maxCapacity: 100,
    status: 'PENDING',
    bannerImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    category: 'TECH',
    clubId: acm.id,
    coordinatorId: coordinator.id,
    engagementScore: 0.0
  })

  // Registrations for event 1 (Hack-a-Sphere)
  const studentsGroup = [student, s1, s2, s3]
  for (let i = 0; i < studentsGroup.length; i++) {
    const s = studentsGroup[i]
    await Registration.create({
      eventId: event1.id,
      studentId: s.id,
      status: 'REGISTERED',
      passCode: `PASS-${event1.id}-${100432 + i * 17}`
    })
  }

  // Registrations for event 2 (AI Summit)
  for (let i = 0; i < 3; i++) {
    const s = studentsGroup[i]
    await Registration.create({
      eventId: event2.id,
      studentId: s.id,
      status: 'REGISTERED',
      passCode: `PASS-${event2.id}-${990423 + i * 29}`
    })
  }

  // Seed attendance for event 3
  for (let i = 0; i < 3; i++) {
    const s = studentsGroup[i]
    await Attendance.create({
      eventId: event3.id,
      studentId: s.id,
      checkedById: coordinator.id
    })
  }

  console.log('Seeding completed successfully.')
}
