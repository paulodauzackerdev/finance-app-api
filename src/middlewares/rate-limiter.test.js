import rateLimit from 'express-rate-limit'

jest.mock('express-rate-limit', () => jest.fn())

describe('globalLimiter', () => {
  const originalEnv = process.env

  afterEach(() => {
    process.env = originalEnv
  })

  it('should create rate limiter with default max when RATE_LIMIT_MAX is not set', () => {
    const mockMiddleware = jest.fn()
    rateLimit.mockReturnValue(mockMiddleware)

    delete process.env.RATE_LIMIT_MAX

    jest.isolateModules(() => {
      const { globalLimiter } = require('./rate-limiter.js')

      expect(rateLimit).toHaveBeenCalledWith({
        windowMs: 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
          error: 'Too many requests, please try again later'
        }
      })

      expect(globalLimiter).toBe(mockMiddleware)
    })
  })

  it('should create rate limiter with custom max from env', () => {
    const mockMiddleware = jest.fn()
    rateLimit.mockReturnValue(mockMiddleware)

    process.env.RATE_LIMIT_MAX = '50'

    jest.isolateModules(() => {
      const { globalLimiter } = require('./rate-limiter.js')

      expect(rateLimit).toHaveBeenCalledWith({
        windowMs: 60 * 1000,
        max: 50,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
          error: 'Too many requests, please try again later'
        }
      })

      expect(globalLimiter).toBe(mockMiddleware)
    })
  })
})
