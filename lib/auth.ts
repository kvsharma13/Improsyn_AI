import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable')
}

export interface JWTPayload {
  userId: number
  email: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Validate email format - ONLY ACCEPTS pharmed.in and mindmapdigital.ai domains
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  // First check if it's a valid email format
  if (!emailRegex.test(email)) {
    return false
  }
  
  // Extract domain and check if it's allowed
  const domain = email.split('@')[1].toLowerCase()
  const allowedDomains = ['pharmed.in', 'mindmapdigital.ai']
  
  return allowedDomains.includes(domain)
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean
  message?: string
} {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters long',
    }
  }
  return { valid: true }
}

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}