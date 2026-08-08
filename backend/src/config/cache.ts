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
    const connectPromise = redisClient.connect()
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connection timeout')), 1000))
    await Promise.race([connectPromise, timeoutPromise])
    isRedisConnected = true
    console.log('Connected to Redis Cache Server successfully.')
  } catch (err) {
    isRedisConnected = false
    console.log('Redis Cache Server is offline. Running with in-memory fallback.')
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
