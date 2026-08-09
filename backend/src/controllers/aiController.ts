import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { AIService } from '../services/aiService'

export async function getRecommendations(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' })
      return
    }
    const recs = await AIService.generateRecommendations(req.user)
    res.status(200).json(recs)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to fetch AI recommendations' })
  }
}

export async function predictAttendance(req: AuthRequest, res: Response): Promise<void> {
  const { category, capacity, dayOfWeek } = req.query
  try {
    const prediction = AIService.predictAttendance(
      category as string,
      Number(capacity || 100),
      dayOfWeek as string
    )
    res.status(200).json(prediction)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to calculate prediction' })
  }
}

export async function getSmartSchedule(req: AuthRequest, res: Response): Promise<void> {
  try {
    const suggestions = await AIService.getSmartScheduleSuggestions()
    res.status(200).json(suggestions)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to calculate smart slots' })
  }
}

export async function getEngagementStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const stats = await AIService.getEngagementStats()
    res.status(200).json(stats)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve stats' })
  }
}

export async function getVectorTeammateMatches(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { computeSkillVector, cosineSimilarity, getClusterName } = require('../services/vectorService')
    const { User } = require('../models/User')

    const targetUserSkills = req.user?.skills || ['React', 'Python', 'ML']
    const targetVector = computeSkillVector(targetUserSkills)

    const students = await User.findAll({ where: { role: 'STUDENT' } })

    const vectorMatches = students.map((s: any) => {
      const peerSkills = s.skills || ['React', 'Python', 'C++', 'ML']
      const peerVector = computeSkillVector(peerSkills)
      const sim = cosineSimilarity(targetVector, peerVector)
      const matchPercentage = Math.round(sim * 100)
      const cluster = getClusterName(peerVector)

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        department: s.department,
        academicYear: s.academicYear,
        xpPoints: s.xpPoints,
        level: s.level,
        profileImage: s.profileImage,
        vectorMatchPercentage: matchPercentage,
        vectorCluster: cluster,
        vectorDimension: peerVector,
        skillsList: peerSkills
      }
    })

    res.status(200).json(vectorMatches)
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to compute vector embeddings' })
  }
}
