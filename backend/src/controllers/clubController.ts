import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { Club } from '../models/Club'
import { User } from '../models/User'

export async function getClubs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const clubs = await Club.findAll({ 
      where: { status: 'ACTIVE' },
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email', 'department', 'profileImage', 'role'] }]
    })
    res.status(200).json(clubs)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve clubs' })
  }
}

export async function createClub(req: AuthRequest, res: Response): Promise<void> {
  const { name, description, bannerImage } = req.body
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' })
      return
    }

    const existing = await Club.findOne({ where: { name } })
    if (existing) {
      res.status(400).json({ message: 'Club name already exists' })
      return
    }

    const newClub = await Club.create({
      name,
      description,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      creatorId: req.user.id,
      membersCount: 1,
      status: 'PENDING'
    })

    res.status(201).json(newClub)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to propose club' })
  }
}
