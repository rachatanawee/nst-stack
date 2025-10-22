import { headers } from 'next/headers'

type RateLimitRecord = {
  count: number
  resetTime: number
}

const rateLimit = new Map<string, RateLimitRecord>()

function cleanupExpiredRecords() {
  const now = Date.now()
  for (const [key, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(key)
    }
  }
}

export async function checkRateLimit(
  limit: number = 10,
  windowMs: number = 60000
): Promise<boolean> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 
             headersList.get('x-real-ip') || 
             'unknown'
  
  const now = Date.now()
  const record = rateLimit.get(ip)
  
  // Lazy cleanup on every 100th request
  if (Math.random() < 0.01) {
    cleanupExpiredRecords()
  }
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

export function getRateLimitInfo(ip: string) {
  const record = rateLimit.get(ip)
  if (!record) return null
  
  return {
    count: record.count,
    remaining: Math.max(0, 10 - record.count),
    resetTime: record.resetTime,
  }
}
