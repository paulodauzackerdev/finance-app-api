import cors from 'cors'

jest.mock('cors', () => jest.fn())

describe('corsMiddleware', () => {
  it('should call cors with the correct options', () => {
    const mockMiddleware = jest.fn()
    cors.mockReturnValue(mockMiddleware)

    // Re-require to trigger module execution with the mock
    jest.isolateModules(() => {
      const { corsMiddleware: middleware } = require('./cors.js')

      expect(cors).toHaveBeenCalledWith({
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
      })

      expect(middleware).toBe(mockMiddleware)
    })
  })
})
