import rateLimit from 'express-rate-limit'

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later'
  }
})

export const loginLimiter = rateLimit({
  windowsMs: 18 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts, please try again later'
  }
})

export const refreshLimiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many refresh attempts, please try again later'
  }
})

export const createUserLimiter = rateLimit({
  windowsMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many accounts created from this IP, please try again later'
  }
})
