import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { Event } from '../models/Event'
import { Club } from '../models/Club'
import { User } from '../models/User'
import { Notification } from '../models/Notification'
import { invalidateCache } from '../config/cache'

async function clearEventsCache() {
  await invalidateCache('events_list_ALL')
  await invalidateCache('events_list_TECH')
  await invalidateCache('events_list_SPORTS')
  await invalidateCache('events_list_ACADEMIC')
  await invalidateCache('events_list_CULTURAL')
}

export async function getPendingEvents(req: AuthRequest, res: Response): Promise<void> {
  try {
    const events = await Event.findAll({ where: { status: 'PENDING' } })
    res.status(200).json(events)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to fetch pending events' })
  }
}

export async function approveEvent(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const { approve } = req.query
  try {
    const isApproved = approve === 'true'
    const event = await Event.findByPk(id)
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }

    event.status = isApproved ? 'APPROVED' : 'REJECTED'
    await event.save()

    // Notify coordinator
    await Notification.create({
      userId: event.coordinatorId,
      title: isApproved ? 'Event Approved!' : 'Event Rejected',
      message: `Your event "${event.title}" has been ${isApproved ? 'approved' : 'rejected'} by admin.`,
      type: 'EVENT_APPROVAL'
    })

    await clearEventsCache()

    res.status(200).json({ message: 'Event status updated' })
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update event status' })
  }
}

export async function getPendingClubs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const clubs = await Club.findAll({ where: { status: 'PENDING' } })
    res.status(200).json(clubs)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to fetch pending clubs' })
  }
}

export async function approveClub(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const { approve } = req.query
  try {
    const isApproved = approve === 'true'
    const club = await Club.findByPk(id)
    if (!club) {
      res.status(404).json({ message: 'Club not found' })
      return
    }

    if (isApproved) {
      club.status = 'ACTIVE'
      await club.save()
    } else {
      await club.destroy()
    }

    res.status(200).json({ message: 'Club status updated' })
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update club status' })
  }
}

export async function getUsersList(req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'department', 'profileImage'] })
    res.status(200).json(users)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to fetch users' })
  }
}
