import { Response, NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || '5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437'

export interface AuthRequest extends Request {
  user?: User
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Authentication token missing' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string }
    const user = await User.findByPk(decoded.id)
    
    if (!user) {
      res.status(401).json({ message: 'User no longer exists' })
      return
    }

    req.user = user
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export function authorizeRoles(...roles: ('STUDENT' | 'FACULTY' | 'COORDINATOR' | 'ADMIN')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Unauthorized access' })
      return
    }
    next()
  }
}
