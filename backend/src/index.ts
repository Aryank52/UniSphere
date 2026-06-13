import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import cron from 'node-cron'

import { sequelize } from './config/database'
import { initRedis } from './config/cache'
import { seedDatabase } from './services/seed'
import { authenticateToken, authorizeRoles } from './middleware/auth'
import { securityHeaders } from './middleware/security'
import { rateLimiter } from './middleware/rateLimiter'
import { Registration, Event, User, AuditLog } from './models'
import { NotificationService } from './services/notificationService'

import * as authController from './controllers/authController'
import * as eventController from './controllers/eventController'
import * as clubController from './controllers/clubController'
import * as attendanceController from './controllers/attendanceController'
import * as notificationController from './controllers/notificationController'
import * as aiController from './controllers/aiController'
import * as adminController from './controllers/adminController'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(securityHeaders)
app.use(rateLimiter)

// Initialize Redis Cache Server
initRedis()

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UniSphere API',
      version: '1.0.0',
      description: 'API Documentation for UniSphere Campus Hub backend'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: ['./src/index.ts'] // Can extract comments here
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ---------------- API ROUTES ----------------

// Auth Routes
app.post('/api/auth/register', authController.register)
app.post('/api/auth/login', authController.login)
app.post('/api/auth/logout', authenticateToken, authController.logout)
app.post('/api/auth/verify-email', authController.verifyEmail)
app.post('/api/auth/reset-password-request', authController.resetPasswordRequest)
app.post('/api/auth/reset-password', authController.resetPassword)
app.put('/api/auth/onboarding', authenticateToken, authController.updateOnboarding)
app.post('/api/auth/2fa/enable', authenticateToken, authController.enable2FA)
app.post('/api/auth/2fa/verify', authenticateToken, authController.verify2FA)
app.get('/api/auth/sessions', authenticateToken, authController.getSessions)

// Events Routes
app.get('/api/events', authenticateToken, eventController.getEvents)
app.get('/api/events/coordinator', authenticateToken, authorizeRoles('FACULTY'), eventController.getCoordinatorEvents)
app.get('/api/events/my-registrations', authenticateToken, authorizeRoles('STUDENT'), eventController.getMyRegistrations)
app.post('/api/events', authenticateToken, authorizeRoles('FACULTY'), eventController.createEvent)
app.delete('/api/events/:id', authenticateToken, authorizeRoles('FACULTY'), eventController.deleteEvent)
app.post('/api/events/:id/register', authenticateToken, authorizeRoles('STUDENT'), eventController.registerForEvent)
app.post('/api/events/:id/feedback', authenticateToken, authorizeRoles('STUDENT'), eventController.submitFeedback)

// Clubs Routes
app.get('/api/clubs', authenticateToken, clubController.getClubs)
app.post('/api/clubs', authenticateToken, clubController.createClub)

// Attendance Routes
app.get('/api/attendance/event/:eventId', authenticateToken, authorizeRoles('FACULTY'), attendanceController.getEventAttendees)
app.post('/api/attendance/check-in', authenticateToken, authorizeRoles('FACULTY'), attendanceController.checkInAttendance)

// Notifications Routes
app.get('/api/notifications', authenticateToken, notificationController.getNotifications)
app.post('/api/notifications/:id/read', authenticateToken, notificationController.readNotification)

// AI Engine Routes
app.get('/api/ai/recommendations', authenticateToken, authorizeRoles('STUDENT'), aiController.getRecommendations)
app.get('/api/ai/predict-attendance', authenticateToken, authorizeRoles('FACULTY'), aiController.predictAttendance)
app.get('/api/ai/smart-schedule', authenticateToken, authorizeRoles('FACULTY'), aiController.getSmartSchedule)
app.get('/api/ai/engagement-stats', authenticateToken, authorizeRoles('FACULTY', 'ADMIN'), aiController.getEngagementStats)

// Admin Approval Routes
app.get('/api/admin/events/pending', authenticateToken, authorizeRoles('ADMIN'), adminController.getPendingEvents)
app.post('/api/admin/events/:id/approve', authenticateToken, authorizeRoles('ADMIN'), adminController.approveEvent)
app.get('/api/admin/clubs/pending', authenticateToken, authorizeRoles('ADMIN'), adminController.getPendingClubs)
app.post('/api/admin/clubs/:id/approve', authenticateToken, authorizeRoles('ADMIN'), adminController.approveClub)
app.get('/api/admin/users', authenticateToken, authorizeRoles('ADMIN'), adminController.getUsersList)

// Fallback Route for SPA Web Filter
app.get('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' })
})

function startNotificationScheduler() {
  console.log('Initializing Real-time Event Reminders Cron Scheduler...');
  // Cron job running every minute
  cron.schedule('* * * * *', async () => {
    try {
      const activeRegistrations = await Registration.findAll({
        where: { status: 'REGISTERED' },
        include: [
          { model: Event, as: 'event' },
          { model: User, as: 'student' }
        ]
      })

      for (const reg of activeRegistrations) {
        const event = reg.event
        const student = reg.student

        if (!event || !student) continue

        // Parse event start time
        const eventDateTime = new Date(`${event.date}T${event.time}`)
        const diffMs = eventDateTime.getTime() - Date.now()
        const diffHours = diffMs / (1000 * 60 * 60)
        const diffMinutes = diffMs / (1000 * 60)

        // 1. 24h email reminder
        if (diffHours <= 24 && diffHours > 1) {
          const logKey = `registrationId:${reg.id}`
          const alreadySent = await AuditLog.findOne({
            where: { action: 'EMAIL_REMINDER_24H', details: logKey }
          })

          if (!alreadySent) {
            const htmlContent = `
              <h2>Upcoming Event Reminder</h2>
              <p>Hi ${student.name},</p>
              <p>This is a reminder that <strong>${event.title}</strong> is starting in less than 24 hours!</p>
              <p><strong>Date:</strong> ${event.date}</p>
              <p><strong>Time:</strong> ${event.time}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p>We look forward to seeing you there!</p>
              <p>Best regards,<br/>UniSphere Campus Team</p>
            `
            await NotificationService.sendEmail(student.email, `Reminder: ${event.title} is starting tomorrow!`, htmlContent)
            await AuditLog.create({ userId: student.id, action: 'EMAIL_REMINDER_24H', details: logKey })
          }
        }

        // 2. 1h SMS reminder
        if (diffHours <= 1 && diffMinutes > 10) {
          const logKey = `registrationId:${reg.id}`
          const alreadySent = await AuditLog.findOne({
            where: { action: 'SMS_REMINDER_1H', details: logKey }
          })

          if (!alreadySent) {
            await NotificationService.sendSMS('+1234567890', `Reminder: "${event.title}" starts in 1 hour at ${event.location}.`)
            await AuditLog.create({ userId: student.id, action: 'SMS_REMINDER_1H', details: logKey })
          }
        }

        // 3. 10m Push reminder
        if (diffMinutes <= 10 && diffMinutes > 0) {
          const logKey = `registrationId:${reg.id}`
          const alreadySent = await AuditLog.findOne({
            where: { action: 'PUSH_REMINDER_10M', details: logKey }
          })

          if (!alreadySent) {
            await NotificationService.sendPushNotification('mock-user-device-token', 'Event Starting Soon!', `"${event.title}" starts in 10 minutes at ${event.location}.`)
            await AuditLog.create({ userId: student.id, action: 'PUSH_REMINDER_10M', details: logKey })
          }
        }
      }
    } catch (error) {
      console.error('Error running notification scheduler:', error)
    }
  })
}

// Database Sync and Server Listen
async function startServer() {
  try {
    await sequelize.authenticate()
    console.log('Database connection authenticated successfully.')

    // Sync models (alter table structure if needed)
    await sequelize.sync()
    console.log('Database tables synchronized.')

    // Seed Data
    await seedDatabase()

    // Start Notification Cron Scheduler
    startNotificationScheduler()

    app.listen(PORT, () => {
      console.log(`Node.js Express Server is listening on http://localhost:${PORT}`)
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`)
    })
  } catch (error) {
    console.error('Fatal error occurred during server startup:', error)
    process.exit(1)
  }
}

startServer()
