import { createHmac, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE = 'lc_admin'
const TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function secret(): string {
  return process.env.ADMIN_PASSWORD ?? 'leadcom-dev-secret'
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

export function createSessionToken(): string {
  const payload = `admin:${Date.now()}`
  const sig = sign(payload)
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const lastColon = decoded.lastIndexOf(':')
    const payload = decoded.slice(0, lastColon)
    const sig = decoded.slice(lastColon + 1)

    // Check signature
    const expected = sign(payload)
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false

    // Check TTL
    const ts = Number(payload.split(':')[1])
    return Date.now() - ts < TTL_MS
  } catch {
    return false
  }
}

export function checkPassword(input: string): boolean {
  const pw = secret()
  // Constant-time comparison to prevent timing attacks
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(pw))
  } catch {
    return false
  }
}
