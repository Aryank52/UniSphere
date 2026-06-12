import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
export const redisClient = createClient({ url: redisUrl })

redisClient.on('error', (err) => {
  console.warn('Redis Cache Server is offline or not configured. Running with in-memory caching bypass.', err.message)
})

let isRedisConnected = false

export async function initRedis() {
  try {
    await redisClient.connect()
    isRedisConnected = true
    console.log('Connected to Redis Cache Server successfully.')
  } catch (err) {
    isRedisConnected = false
    // Suppress error since we run with fallback
  }
}

export async function getCachedData(key: string): Promise<any | null> {
  if (!isRedisConnected) return null
  try {
    const data = await redisClient.get(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    return null
  }
}

export async function setCachedData(key: string, data: any, ttlSeconds = 3600): Promise<void> {
  if (!isRedisConnected) return
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data))
  } catch (e) {
    // ignore
  }
}

export async function invalidateCache(key: string): Promise<void> {
  if (!isRedisConnected) return
  try {
    await redisClient.del(key)
  } catch (e) {
    // ignore
  }
}
