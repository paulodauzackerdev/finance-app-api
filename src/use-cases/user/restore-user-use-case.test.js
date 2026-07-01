import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { RestoreUserUseCase } from './restore-user-use-case.js'
import { removePasswordFromUser } from '../../helpers/user.js'
import { UserNotFoundError } from '../../errors/user.js'

jest.mock('../../helpers/user.js', () => ({
  removePasswordFromUser: jest.fn()
}))

describe('RestoreUserUseCase', () => {
  let restoreUserUseCase
  let mockUserRepository

  const mockDeletedUser = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    passwordHash: 'hashed_password',
    deletedAt: new Date('2026-06-01')
  }

  const mockRestoredUser = {
    ...mockDeletedUser,
    deletedAt: null
  }

  const mockUserWithoutPassword = {
    id: mockRestoredUser.id,
    firstName: mockRestoredUser.firstName,
    lastName: mockRestoredUser.lastName,
    email: mockRestoredUser.email
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUserRepository = {
      findById: jest.fn(),
      restore: jest.fn()
    }

    restoreUserUseCase = new RestoreUserUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should restore a user successfully', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(mockDeletedUser)
      mockUserRepository.restore.mockResolvedValue(mockRestoredUser)
      removePasswordFromUser.mockReturnValue(mockUserWithoutPassword)

      const result = await restoreUserUseCase.execute(userId)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId, true)
      expect(mockUserRepository.restore).toHaveBeenCalledWith(userId)
      expect(removePasswordFromUser).toHaveBeenCalledWith(mockRestoredUser)
      expect(result).toEqual(mockUserWithoutPassword)
      expect(result).not.toHaveProperty('passwordHash')
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(restoreUserUseCase.execute(userId)).rejects.toThrow(
        UserNotFoundError
      )

      expect(mockUserRepository.restore).not.toHaveBeenCalled()
    })

    it('should throw UserNotFoundError when user is not deleted', async () => {
      const activeUser = { ...mockDeletedUser, deletedAt: null }
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(activeUser)

      await expect(restoreUserUseCase.execute(userId)).rejects.toThrow(
        UserNotFoundError
      )

      expect(mockUserRepository.restore).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(restoreUserUseCase.execute('invalid-uuid')).rejects.toThrow(
        ZodError
      )

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(mockUserRepository.restore).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const userId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockRejectedValue(dbError)

      await expect(restoreUserUseCase.execute(userId)).rejects.toThrow(
        'Database connection failed'
      )

      expect(mockUserRepository.restore).not.toHaveBeenCalled()
    })
  })
})
