import { z } from 'zod'
import { errorHandler } from './error-handler.js'
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  ForbiddenUserDeletionError,
  UserDeletedError
} from '../errors/user.js'
import {
  TransactionNotFoundError,
  TransactionUnauthorizedError
} from '../errors/transaction.js'

describe('errorHandler', () => {
  let req
  let res
  let json
  let next

  beforeEach(() => {
    json = jest.fn()
    res = {
      status: jest.fn().mockReturnValue({ json })
    }
    req = {
      method: 'GET',
      path: '/users/123'
    }
    next = jest.fn()

    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('404 - UserNotFoundError', () => {
    it('should return 404 with error message', () => {
      const error = new UserNotFoundError()

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({ error: 'User not found' })
    })
  })

  describe('404 - TransactionNotFoundError', () => {
    it('should return 404 with error message', () => {
      const error = new TransactionNotFoundError()

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({ error: 'Transaction not found' })
    })
  })

  describe('401 - InvalidCredentialsError', () => {
    it('should return 401 with error message', () => {
      const error = new Error('Invalid email or password')
      error.name = 'InvalidCredentialsError'

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(json).toHaveBeenCalledWith({ error: 'Invalid email or password' })
    })

    it('should handle InvalidCredentialsError by name check', () => {
      const error = new Error('Custom auth error')
      error.name = 'InvalidCredentialsError'

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
    })
  })

  describe('403 - ForbiddenUserDeletionError', () => {
    it('should return 403 with error message', () => {
      const error = new ForbiddenUserDeletionError()

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(json).toHaveBeenCalledWith({ error: 'Cannot delete this user' })
    })
  })

  describe('403 - TransactionUnauthorizedError', () => {
    it('should return 403 with error message', () => {
      const error = new TransactionUnauthorizedError()

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(json).toHaveBeenCalledWith({
        error: 'You are not authorized to access this transaction'
      })
    })
  })

  describe('409 - UserAlreadyExistsError', () => {
    it('should return 409 with error message', () => {
      const error = new UserAlreadyExistsError()

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(json).toHaveBeenCalledWith({ error: 'Email already exists' })
    })
  })

  describe('409 - UserDeletedError', () => {
    it('should return 409 with error message', () => {
      const error = new UserDeletedError()

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(json).toHaveBeenCalledWith({
        error: 'This account has been deactivated and can be restored'
      })
    })
  })

  describe('400 - ZodError', () => {
    it('should return 400 with validation details', () => {
      const schema = z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(8, 'Password must be at least 8 characters')
      })

      let zodError

      try {
        schema.parse({ email: 'invalid', password: 'short' })
      } catch (e) {
        zodError = e
      }

      errorHandler(zodError, req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: [
          { field: 'email', message: 'Invalid email format' },
          {
            field: 'password',
            message: 'Password must be at least 8 characters'
          }
        ]
      })
    })
  })

  describe('500 - Internal server error', () => {
    it('should return 500 for unknown errors', () => {
      const error = new Error('Something went wrong')

      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })

    it('should log the full error for unknown errors', () => {
      const error = new Error('Database failure')

      errorHandler(error, req, res, next)

      expect(console.error).toHaveBeenCalled()
    })
  })
})
