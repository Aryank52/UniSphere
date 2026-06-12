import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { Notification } from '../models/Notification'

export async function getNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' })
      return
    }
    const notifs = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    res.status(200).json(notifs)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve notifications' })
  }
}

export async function readNotification(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const notif = await Notification.findByPk(id)
    if (!notif) {
      res.status(404).json({ message: 'Notification not found' })
      return
    }

    notif.isRead = true
    await notif.save()
    res.status(200).json({ message: 'Read success' })
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update notification' })
  }
}
