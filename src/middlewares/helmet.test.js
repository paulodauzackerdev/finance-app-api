import helmet from 'helmet'

jest.mock('helmet', () => jest.fn())

describe('docsHelmet', () => {
  it('should call helmet with the correct options', () => {
    const mockMiddleware = jest.fn()
    helmet.mockReturnValue(mockMiddleware)

    jest.isolateModules(() => {
      const { docsHelmet: middleware } = require('./helmet.js')

      expect(helmet).toHaveBeenCalledWith({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              'cdn.jsdelivr.net',
              'fonts.googleapis.com',
              'unpkg.com'
            ],
            fontSrc: ["'self'", 'fonts.scalar.com', 'data:'],
            imgSrc: ["'self'", 'data:', 'cdn.jsdelivr.net'],
            connectSrc: ["'self'"]
          }
        }
      })

      expect(middleware).toBe(mockMiddleware)
    })
  })
})
