import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { Event } from '../models/Event'
import { Club } from '../models/Club'
import { Registration } from '../models/Registration'
import { Feedback } from '../models/Feedback'
import { Notification } from '../models/Notification'
import { User } from '../models/User'
import { AIService } from '../services/aiService'
import { NotificationService } from '../services/notificationService'
import { GamificationService } from '../services/gamificationService'
import { getCachedData, setCachedData, invalidateCache } from '../config/cache'

async function clearEventsCache() {
  await invalidateCache('events_list_ALL')
  await invalidateCache('events_list_TECH')
  await invalidateCache('events_list_SPORTS')
  await invalidateCache('events_list_ACADEMIC')
  await invalidateCache('events_list_CULTURAL')
}

export async function getEvents(req: AuthRequest, res: Response): Promise<void> {
  const { category } = req.query
  const cacheKey = `events_list_${category || 'ALL'}`
  try {
    const cached = await getCachedData(cacheKey)
    if (cached) {
      res.status(200).json(cached)
      return
    }
    const whereClause: any = { status: 'APPROVED' }
    if (category && category !== 'ALL') {
      whereClause.category = (category as string).toUpperCase()
    }
    const events = await Event.findAll({ where: whereClause, include: [{ model: Club, as: 'club' }] })
    await setCachedData(cacheKey, events, 300) // cache for 5 mins
    res.status(200).json(events)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve events' })
  }
}

export async function getCoordinatorEvents(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' })
      return
    }
    const events = await Event.findAll({ where: { coordinatorId: req.user.id } })
    res.status(200).json(events)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve coordinator events' })
  }
}

export async function getMyRegistrations(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' })
      return
    }
    const regs = await Registration.findAll({
      where: { studentId: req.user.id, status: 'REGISTERED' },
      include: [{ model: Event, as: 'event', include: [{ model: Club, as: 'club' }] }]
    })

    const registeredEvents = regs.map(r => {
      const e = r.event.toJSON() as any
      e.passCode = r.passCode
      return e
    })

    res.status(200).json(registeredEvents)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve registered events' })
  }
}

export async function createEvent(req: AuthRequest, res: Response): Promise<void> {
  const { title, description, date, time, location, maxCapacity, category, clubId } = req.body
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' })
      return
    }

    const club = await Club.findByPk(clubId)
    if (!club) {
      res.status(404).json({ message: 'Club not found' })
      return
    }

    let campus = 'Bidholi'
    if (location) {
      const lowerLoc = location.toLowerCase()
      if (lowerLoc.includes('kandoli')) {
        campus = 'Kandoli'
      } else if (lowerLoc.includes('development') || lowerLoc.includes('dev')) {
        campus = 'Development'
      }
    }

    const categoryImages: any = {
      TECH: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      SPORTS: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      ACADEMIC: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      CULTURAL: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
    }

    const newEvent = await Event.create({
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
    })

    await clearEventsCache()

    res.status(201).json(newEvent)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to create event' })
  }
}

export async function deleteEvent(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const event = await Event.findByPk(id)
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }

    await event.destroy()
    await clearEventsCache()
    res.status(204).send()
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to delete event' })
  }
}

export async function registerForEvent(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' })
      return
    }

    const event = await Event.findByPk(id)
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }

    const activeRegsCount = await Registration.count({ where: { eventId: id, status: 'REGISTERED' } })
    if (activeRegsCount >= event.maxCapacity) {
      res.status(400).json({ message: 'Event has reached maximum capacity!' })
      return
    }

    const alreadyRegistered = await Registration.findOne({ where: { eventId: id, studentId: req.user.id, status: 'REGISTERED' } })
    if (alreadyRegistered) {
      res.status(400).json({ message: 'You are already registered for this event!' })
      return
    }

    const code = `PASS-${id}-${Math.floor(100000 + Math.random() * 900000)}`
    const registration = await Registration.create({
      eventId: event.id,
      studentId: req.user.id,
      status: 'REGISTERED',
      passCode: code
    })

    // Notify student
    await Notification.create({
      userId: req.user.id,
      title: 'Registration Confirmed',
      message: `You have successfully registered for ${event.title}. Pass code: ${code}`,
      type: 'REGISTRATION'
    })

    // Call simulated SMTP email notification service
    const studentUser = await User.findByPk(req.user.id)
    if (studentUser) {
      await NotificationService.sendEmail(
        studentUser.email,
        `UniSphere Confirmed Reservation: ${event.title}`,
        `<div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
          <h2 style="color: #10b981;">Registration Confirmed!</h2>
          <p>Hello ${studentUser.name},</p>
          <p>Your boarding pass QR code for <strong>"${event.title}"</strong> is confirmed!</p>
          <p><strong>Ticket Passcode:</strong> ${code}<br/>
          <strong>Location:</strong> ${event.location}<br/>
          <strong>Date & Time:</strong> ${event.date} at ${event.time}</p>
          <p>Thank you,<br/>UniSphere Campus Hub</p>
        </div>`
      )
    }

    res.status(201).json(registration)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to register' })
  }
}

export async function submitFeedback(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const { rating, comment } = req.body
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' })
      return
    }

    const event = await Event.findByPk(id)
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }

    await Feedback.create({
      eventId: event.id,
      studentId: req.user.id,
      rating,
      comment
    })

    // Award 10 XP for leaving feedback
    await GamificationService.awardXP(req.user.id, 10, `Submitted feedback for event: ${event.title}`)

    // Recalculate engagement score
    const newScore = await AIService.calculateEngagementScore(event)
    event.engagementScore = newScore
    await event.save()

    res.status(200).send()
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to submit feedback' })
  }
}
