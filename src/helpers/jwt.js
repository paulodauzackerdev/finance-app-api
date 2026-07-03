import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { JwtSecretUndefinedError } from '../errors/credentials.js'

const SECRET = process.env.JWT_SECRET
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'

const REFRESH_EXPIRES_IN_MS =
  parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS, 10) || 7 * 24 * 60 * 60 * 1000

if (!SECRET || SECRET.length < 32) {
  throw new JwtSecretUndefinedError(
    'JWT_SECRET must be at least 32 characters long'
  )
}

export const jwtHelper = {
  signAccessToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXPIRES_IN })
  },

  verify(token) {
    return jwt.verify(token, SECRET)
  },

  generateRefreshToken() {
    return crypto.randomBytes(40).toString('base64url')
  },

  hashRefreshToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
  },

  getRefreshExpiresAt() {
    return new Date(Date.now() + REFRESH_EXPIRES_IN_MS)
  }
}
