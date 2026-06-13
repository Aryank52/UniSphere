import bcrypt from 'bcryptjs'
import { User } from '../models/User'
import { Club } from '../models/Club'
import { Event } from '../models/Event'
import { Registration } from '../models/Registration'
import { Attendance } from '../models/Attendance'

export async function seedDatabase() {
  const userCount = await User.count()
  if (userCount > 0) {
    return
  }

  console.log('Seeding initial campus data with UPES directory details...')

  const hashedPassword = await bcrypt.hash('password', 10)

  // 1. Create original loggable users
  const student = await User.create({
    name: 'Alex Rivera',
    email: 'student@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  })

  const faculty = await User.create({
    name: 'Dr. Sarah Jenkins',
    email: 'faculty@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Data Science',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  })

  const admin = await User.create({
    name: 'Admin Chief',
    email: 'admin@unisphere.edu',
    password: hashedPassword,
    role: 'ADMIN',
    department: 'Administration',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  })

  // 1b. Create additional actual UPES faculty
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

  const f3 = await User.create({
    name: 'Prof. Vinod Patidar',
    email: 'vinod@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  })

  const f4 = await User.create({
    name: 'Dr. Vijendra Singh',
    email: 'vijendra@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  })

  const f5 = await User.create({
    name: 'Dr. Sanjeev Kumar',
    email: 'sanjeev@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  })

  const f6 = await User.create({
    name: 'Dr. Kaushik Ghosh',
    email: 'kaushik@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  })

  const f7 = await User.create({
    name: 'Dr. Sonali Vyas',
    email: 'sonali@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  })

  const f8 = await User.create({
    name: 'Dr. Vishal Sharma',
    email: 'vishal@unisphere.edu',
    password: hashedPassword,
    role: 'FACULTY',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  })

  // 1c. Create additional student users
  const s1 = await User.create({
    name: 'Aarav Sharma',
    email: 'aarav@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
  })

  const s2 = await User.create({
    name: 'Ananya Iyer',
    email: 'ananya@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Data Science',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  })

  const s3 = await User.create({
    name: 'Rohan Verma',
    email: 'rohan@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  })

  const s4 = await User.create({
    name: 'Aditi Rao',
    email: 'aditi@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Applied Arts',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  })

  const s5 = await User.create({
    name: 'Kabir Malhotra',
    email: 'kabir@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Business Admin',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  })

  const s6 = await User.create({
    name: 'Ishaan Joshi',
    email: 'ishaan@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Computer Science',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  })

  const s7 = await User.create({
    name: 'Sanya Gupta',
    email: 'sanya@unisphere.edu',
    password: hashedPassword,
    role: 'STUDENT',
    department: 'Data Science',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  })

  // 2. Create Clubs with specific coordinators/creators
  const acm = await Club.create({
    name: 'UPES ACM Student Chapter',
    description: 'Deep dive into algorithmic challenges, hackathons, and software engineering principles at UPES.',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    creatorId: f2.id, // Prof. Neelu Jyothi Ahuja
    membersCount: 1420,
    status: 'ACTIVE'
  })

  const ieee = await Club.create({
    name: 'UPES IEEE Student Branch',
    description: 'Promoting technical innovation and excellence in engineering, science, and computing at UPES Dehradun.',
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    creatorId: f4.id, // Dr. Vijendra Singh
    membersCount: 980,
    status: 'ACTIVE'
  })

  const nss = await Club.create({
    name: 'UPES NSS Chapter',
    description: 'National Service Scheme unit at UPES, focusing on rural development, blood donation drives, and sustainability campaigns.',
    bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    creatorId: f6.id, // Dr. Kaushik Ghosh
    membersCount: 640,
    status: 'ACTIVE'
  })

  const uurja = await Club.create({
    name: 'UPES Uurja Cultural Club',
    description: 'The premier cultural hub of UPES showcasing music, dance, theatre, and visual arts competitions.',
    bannerImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    creatorId: f7.id, // Dr. Sonali Vyas
    membersCount: 420,
    status: 'ACTIVE'
  })

  const mtc = await Club.create({
    name: 'UPES Microsoft Technical Community',
    description: 'Fostering industry readiness and hands-on coding in Microsoft technologies and cloud services at UPES.',
    bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    creatorId: f8.id, // Dr. Vishal Sharma
    membersCount: 880,
    status: 'ACTIVE'
  })

  const sports = await Club.create({
    name: 'UPES Sports Committee',
    description: 'Hosting intramural sporting leagues, athletic meets, and Spandan sports events at Bidholi campus.',
    bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    creatorId: f5.id, // Dr. Sanjeev Kumar
    membersCount: 1120,
    status: 'ACTIVE'
  })

  // 3. Create Events
  const event1 = await Event.create({
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
    coordinatorId: f2.id,
    engagementScore: 92.5
  })

  const event2 = await Event.create({
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
    coordinatorId: f4.id,
    engagementScore: 78.0
  })

  const event3 = await Event.create({
    title: 'UPES NSS Cleanliness & Greenery Drive',
    description: 'Help NSS UPES collect plastic waste and set up recycling hubs near the Bidholi student dormitories. T-shirts and refreshments provided to volunteers!',
    date: '2026-06-12',
    time: '08:00',
    location: 'Bidholi Quadrangle, Bidholi Campus',
    campus: 'Bidholi',
    maxCapacity: 150,
    status: 'APPROVED',
    bannerImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
    category: 'SPORTS',
    clubId: nss.id,
    coordinatorId: f6.id,
    engagementScore: 65.2
  })

  const event4 = await Event.create({
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
    coordinatorId: f2.id,
    engagementScore: 0.0
  })

  // Registrations for event 1 (Hack-a-Sphere)
  const studentsGroup = [student, s1, s2, s3, s4, s5, s6, s7]
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
  for (let i = 0; i < 4; i++) {
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
      checkedById: f6.id
    })
  }

  console.log('Seeding completed successfully.')
}
