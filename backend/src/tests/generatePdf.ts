import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { AIService } from '../services/aiService'

// Create a PDF document
const doc = new PDFDocument({ margin: 50, size: 'A4' })

// Output file path
const outputPath = path.join(__dirname, '../../../prd_unisphere.pdf')
const writeStream = fs.createWriteStream(outputPath)
doc.pipe(writeStream)

// Formatting Helper Methods
function addTitle(text: string) {
  doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e1b4b').text(text, { align: 'center' })
  doc.moveDown(0.4)
}

function addSubtitle(text: string) {
  doc.fontSize(11).font('Helvetica-Oblique').fillColor('#475569').text(text, { align: 'center' })
  doc.moveDown(1.5)
}

function addHeading(text: string) {
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#0f172a').text(text)
  doc.moveDown(0.5)
}

function addSubheading(text: string) {
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#334155').text(text)
  doc.moveDown(0.3)
}

function addParagraph(text: string) {
  doc.fontSize(9.5).font('Helvetica').fillColor('#334155').text(text, { align: 'justify', lineGap: 3.5 })
  doc.moveDown(0.8)
}

function addBullet(title: string, desc: string) {
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#0f172a').text(`• ${title}: `, { continued: true })
  doc.font('Helvetica').fillColor('#334155').text(desc, { lineGap: 2.5 })
  doc.moveDown(0.4)
}

function addHorizontalLine() {
  doc.moveDown(0.3)
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cbd5e1').lineWidth(0.8).stroke()
  doc.moveDown(0.9)
}

// --- Page 1: Metadata & Executive Summary & User Personas ---
doc.rect(50, 45, 495, 3.5).fill('#4f46e5')
doc.moveDown(1.2)

addTitle('UNISPHERE: CAMPUS HUB')
addSubtitle('Product Requirement Document (PRD) v2.0')

addHorizontalLine()

addHeading('1. Executive Summary')
addParagraph(
  'UniSphere is a full-stack campus management and events discovery portal designed to centralize student extracurricular life, automate coordinator check-in workflows, and provide analytical telemetry dashboards. By combining modern databases, caching layers, and semantic artificial intelligence, the platform resolves common administrative pain points such as double-booked venues, poor student event engagement, and manual paper-based attendance registers.'
)
addParagraph(
  'This iteration details a complete technology migration. The database models, REST endpoint controllers, security guards, and seeding scripts have been ported to Node.js (TypeScript/Express). The frontend state container has been refactored onto Redux Toolkit. Advanced integrations are introduced, including simulated SMTP email traces, Swagger API documents, Redis caching, Cosine-Similarity RAG vector heuristics, and 8 highly detailed interactive drawers.'
)

addHorizontalLine()

addHeading('2. User Personas & Objectives')

addSubheading('A. Student (Alex Rivera)')
addBullet('Profile', 'Senior Computer Science major, Honors candidate seeking relevant technical seminars.')
addBullet('Pain Points', 'Physical flyers on bulletin boards, isolated group chats, lost boarding ticket codes.')
addBullet('Goal', 'Discover events matching profile tags, display digital check-in passes, request transcript packages, and review courses.')

doc.moveDown(0.4)
addSubheading('B. Faculty Coordinator (Dr. Sarah Jenkins)')
addBullet('Profile', 'Assistant Professor of Data Science and student organization advisor.')
addBullet('Pain Points', 'Resource double-bookings, manual attendance tracking, low participation rates.')
addBullet('Goal', 'Publish non-conflicting event schedules, check in attendees via simulated QR code scanner, and evaluate engagement predictions.')

doc.moveDown(0.4)
addSubheading('C. Administrator (Admin Chief)')
addBullet('Profile', 'Director of Student Life Operations.')
addBullet('Pain Points', 'Cluttered manual approval pipelines, lack of diagnostics metrics, complex local setup.')
addBullet('Goal', 'Moderate proposed clubs, verify server parameters, flush Redis caches, and run DB seed synchronization.')

// --- Page 2: Functional Features & Interactive Drawers ---
doc.addPage()
doc.rect(50, 45, 495, 3.5).fill('#4f46e5')
doc.moveDown(1.2)

addHeading('3. Product Features & Drawers')
addParagraph(
  'UniSphere implements 8 interactive sliding drawers in the user interface to simulate real-time university services and administrative dashboard options:'
)

addBullet('Announcements', 'Renders campus news feeds (e.g. term registration schedules, sports tryouts) with pin priority filters.')
addBullet('Academic Calendar', 'Interactive month grid. Selecting date filters display agenda items. Features a form to add custom task reminders.')
addBullet('Campus Directory', 'List of campus members with status tags (Online, Offline, In Meeting). Features search query filtering.')
addBullet('Academic Record', 'Displays cumulative CGPA (3.92) and completed credits. Includes a Request Transcript button with simulated email dispatch.')
addBullet('Course Catalog', 'Searchable course database with professor names and syllabus details. Toggles simulated enrollment requests.')
addBullet('Faculty Hub', 'Advisory office lookup directory. Includes a scheduled consultation booking scheduler.')
addBullet('Student Affairs', 'Overview of housing, placements, and health clinics. Includes a support ticket submit form.')
addBullet('System Admin', 'Renders server diagnostics (SQLite database, Redis fallback, CPU, RAM). Includes buttons to run seeder scripts and clear Redis caches.')

addHorizontalLine()

addHeading('4. AI & Intelligent Systems (RAG & Regression)')

addSubheading('4.1 RAG Vector Similarity Search Heuristics')
addParagraph(
  'Calculated in real-time inside the AI Service. Student interests (e.g. computer science, machine learning, sports) and event description details are parsed, stop-words are filtered, and frequency term vectors are generated. The system calculates the Cosine Similarity coefficient (the dot product of both vectors divided by their magnitudes) to rank event matches on the student dashboard, complete with justification strings.'
)

addSubheading('4.2 Attendance Regression Predictor')
addParagraph(
  'Uses historical attributes (event categories, capacities, and day of week) to predict attendance rates and occupancy limits on the coordinator dashboard, identifying factors contributing to registration likelihood.'
)

addSubheading('4.3 Smart Schedule Suggestion')
addParagraph(
  'Conflict optimization suggestions identify optimal dates and times with the lowest potential conflict index based on current calendars and coordinator workloads.'
)

// --- Page 3: Technical Architecture & Schemas ---
doc.addPage()
doc.rect(50, 45, 495, 3.5).fill('#4f46e5')
doc.moveDown(1.2)

addHeading('5. Technical Architecture & Database Schemas')

addSubheading('5.1 Express API Backend & Dual-Mode DB')
addParagraph(
  'Built with Express (Node.js/TypeScript) utilizing Sequelize ORM. The database connects to PostgreSQL in production and falls back to zero-config SQLite (`unisphere.sqlite`) in dev mode for offline ease of use.'
)

addSubheading('5.2 Caching Strategy (Redis)')
addParagraph(
  'Event schedules are cached in Redis to minimize database queries. Cache is invalidated on event creation, deletion, or admin approval. Fallback to in-memory bypass is active if Redis is offline.'
)

addSubheading('5.3 System Data Models')
addBullet('Users', 'id (PK), name, email, password, role (STUDENT/FACULTY/ADMIN), department, profileImage')
addBullet('Clubs', 'id (PK), name, description, bannerImage, creatorId, membersCount, status (PENDING/ACTIVE)')
addBullet('Events', 'id (PK), title, description, date, time, location, campus, maxCapacity, status (PENDING/APPROVED/REJECTED), bannerImage, category, clubId, coordinatorId, engagementScore')
addBullet('Registrations', 'id (PK), eventId, studentId, status (REGISTERED/CANCELLED), passCode')
addBullet('Attendances', 'id (PK), eventId, studentId, checkedInAt, checkedById')
addBullet('Notifications', 'id (PK), userId, title, message, type, isRead')
addBullet('Feedbacks', 'id (PK), eventId, studentId, rating (1-5), comment')

addHorizontalLine()

addHeading('6. Quality Assurance, CI/CD, & Cloud Blueprint')

addSubheading('6.1 Testing Suite')
addParagraph(
  'Configured unit tests in package.json (run via npm test) which assert JWT tokenization, Cosine Similarity calculations, and prediction regression models.'
)

addSubheading('6.2 CI/CD Pipelines')
addParagraph(
  'Provided a GitHub Actions CI/CD configuration (.github/workflows/ci.yml) which automatically triggers dependencies installations, TypeScript compiler builds, and unit test suites on pushes and pull requests.'
)

addSubheading('6.3 Cloud & Multi-Container Blueprints')
addParagraph(
  'Provided docker-compose.yml files linking PostgreSQL database, Redis cache, Node backend, and Nginx frontend client, alongside Render render.yaml blueprints and Vercel routing configs.'
)

// End the document
doc.end()

writeStream.on('finish', () => {
  console.log('PDF Compiled successfully at: prd_unisphere.pdf')
})
