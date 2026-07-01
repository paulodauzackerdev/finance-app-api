import bcrypt from 'bcrypt'
import { passwordHelper } from './password.js'

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}))

describe('passwordHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('hash', () => {
    it('should hash password with 12 salt rounds', async () => {
      const password = 'Senha123!'
      const hashedPassword = 'hashed_value'

      bcrypt.hash.mockResolvedValue(hashedPassword)

      const result = await passwordHelper.hash(password)

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12)
      expect(bcrypt.hash).toHaveBeenCalledTimes(1)
      expect(result).toBe(hashedPassword)
    })

    it('should propagate bcrypt errors', async () => {
      const error = new Error('Hashing failed')

      bcrypt.hash.mockRejectedValue(error)

      await expect(passwordHelper.hash('password')).rejects.toThrow(
        'Hashing failed'
      )
    })
  })

  describe('compare', () => {
    it('should return true when password matches hash', async () => {
      const password = 'Senha123!'
      const passwordHash = 'hashed_value'

      bcrypt.compare.mockResolvedValue(true)

      const result = await passwordHelper.compare(password, passwordHash)

      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash)
      expect(bcrypt.compare).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should return false when password does not match hash', async () => {
      const password = 'WrongPassword'
      const passwordHash = 'hashed_value'

      bcrypt.compare.mockResolvedValue(false)

      const result = await passwordHelper.compare(password, passwordHash)

      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash)
      expect(bcrypt.compare).toHaveBeenCalledTimes(1)
      expect(result).toBe(false)
    })

    it('should propagate bcrypt errors', async () => {
      const error = new Error('Comparison failed')

      bcrypt.compare.mockRejectedValue(error)

      await expect(passwordHelper.compare('password', 'hash')).rejects.toThrow(
        'Comparison failed'
      )
    })
  })
})
