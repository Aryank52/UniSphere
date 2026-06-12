import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || '5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437'
const JWT_EXPIRATION = '24h'

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password, role, department } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(password || 'password', 10)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'STUDENT',
      department: department || 'General Science',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    })

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    )

    res.status(201).json({ user: newUser, token })
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error occurred during registration' })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const isValid = await bcrypt.compare(password || 'password', user.password)
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    )

    res.status(200).json({ user, token })
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error occurred during login' })
  }
}
