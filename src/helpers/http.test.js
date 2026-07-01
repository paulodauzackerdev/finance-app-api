import {
  ok,
  created,
  noContent,
  badRequest,
  forbidden,
  notFound,
  conflict,
  internalServerError
} from './http.js'

describe('http helpers', () => {
  let res
  let json
  let end

  beforeEach(() => {
    json = jest.fn()
    end = jest.fn()
    res = {
      status: jest.fn().mockReturnValue({ json, end })
    }
  })

  describe('ok', () => {
    it('should return 200 with body', () => {
      const body = { users: [] }

      ok(res, body)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(json).toHaveBeenCalledWith(body)
      expect(json).toHaveBeenCalledTimes(1)
    })
  })

  describe('created', () => {
    it('should return 201 with body', () => {
      const body = { id: 'uuid', name: 'Test' }

      created(res, body)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(json).toHaveBeenCalledWith(body)
      expect(json).toHaveBeenCalledTimes(1)
    })
  })

  describe('noContent', () => {
    it('should return 204 without body', () => {
      noContent(res)

      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(end).toHaveBeenCalledTimes(1)
    })
  })

  describe('badRequest', () => {
    it('should return 400 with error message', () => {
      const message = 'Invalid input'

      badRequest(res, message)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(json).toHaveBeenCalledWith({ error: message })
      expect(json).toHaveBeenCalledTimes(1)
    })
  })

  describe('forbidden', () => {
    it('should return 403 with error message', () => {
      const message = 'Access denied'

      forbidden(res, message)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(json).toHaveBeenCalledWith({ error: message })
      expect(json).toHaveBeenCalledTimes(1)
    })
  })

  describe('notFound', () => {
    it('should return 404 with error message', () => {
      const message = 'User not found'

      notFound(res, message)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(json).toHaveBeenCalledWith({ error: message })
      expect(json).toHaveBeenCalledTimes(1)
    })
  })

  describe('conflict', () => {
    it('should return 409 with error message', () => {
      const message = 'Email already exists'

      conflict(res, message)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(json).toHaveBeenCalledWith({ error: message })
      expect(json).toHaveBeenCalledTimes(1)
    })
  })

  describe('internalServerError', () => {
    it('should return 500 with default message when no message provided', () => {
      internalServerError(res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(json).toHaveBeenCalledWith({ error: 'Internal server error' })
      expect(json).toHaveBeenCalledTimes(1)
    })

    it('should return 500 with custom message', () => {
      const message = 'Database timeout'

      internalServerError(res, message)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(json).toHaveBeenCalledWith({ error: message })
      expect(json).toHaveBeenCalledTimes(1)
    })
  })
})
