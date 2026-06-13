import { Request, Response, NextFunction } from 'express'

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 200 // 200 requests per 15 minutes per IP

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()

  const record = ipRequestCounts.get(ip)

  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS
    })
    next()
    return
  }

  record.count += 1
  if (record.count > MAX_REQUESTS) {
    res.status(429).json({
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    })
    return
  }

  next()
}
