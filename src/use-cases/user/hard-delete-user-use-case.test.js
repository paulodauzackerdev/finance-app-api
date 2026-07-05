import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { HardDeleteUserUseCase } from './hard-delete-user-use-case.js'
import { removePasswordFromUser } from '../../helpers/user.js'
import {
  UserNotFoundError,
  ForbiddenUserDeletionError
} from '../../errors/user.js'

jest.mock('../../helpers/user.js', () => ({
  removePasswordFromUser: jest.fn()
}))

describe('HardDeleteUserUseCase', () => {
  let hardDeleteUserUseCase
  let mockUserRepository

  const mockUser = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    passwordHash: 'hashed_password'
  }

  const mockDeletedUser = {
    ...mockUser,
    deletedAt: new Date('2026-06-01')
  }

  const mockUserWithoutPassword = {
    id: mockDeletedUser.id,
    firstName: mockDeletedUser.firstName,
    lastName: mockDeletedUser.lastName,
    email: mockDeletedUser.email,
    deletedAt: mockDeletedUser.deletedAt
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUserRepository = {
      findById: jest.fn(),
      hardDelete: jest.fn()
    }

    hardDeleteUserUseCase = new HardDeleteUserUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should hard delete a user successfully', async () => {
      const userId = mockUser.id

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.hardDelete.mockResolvedValue(mockDeletedUser)
      removePasswordFromUser.mockReturnValue(mockUserWithoutPassword)

      const result = await hardDeleteUserUseCase.execute(
        userId,
        userId,
        'admin'
      )

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId, true)
      expect(mockUserRepository.hardDelete).toHaveBeenCalledWith(userId)
      expect(removePasswordFromUser).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(mockUserWithoutPassword)
      expect(result).not.toHaveProperty('passwordHash')
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        hardDeleteUserUseCase.execute(userId, userId, 'admin')
      ).rejects.toThrow(UserNotFoundError)

      expect(mockUserRepository.hardDelete).not.toHaveBeenCalled()
    })

    it('should throw ForbiddenUserDeletionError when trying to delete admin user', async () => {
      const adminUserId = faker.string.uuid()
      const adminUser = { ...mockUser, id: adminUserId }

      process.env.ADMIN_USER_ID = adminUserId
      mockUserRepository.findById.mockResolvedValue(adminUser)

      await expect(
        hardDeleteUserUseCase.execute(adminUserId, adminUserId, 'admin')
      ).rejects.toThrow(ForbiddenUserDeletionError)

      expect(mockUserRepository.hardDelete).not.toHaveBeenCalled()

      delete process.env.ADMIN_USER_ID
    })

    it('should hard delete successfully even when hardDelete returns null', async () => {
      const userId = mockUser.id

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.hardDelete.mockResolvedValue(null)
      removePasswordFromUser.mockReturnValue(mockUserWithoutPassword)

      const result = await hardDeleteUserUseCase.execute(
        userId,
        userId,
        'admin'
      )

      expect(mockUserRepository.hardDelete).toHaveBeenCalledWith(userId)
      expect(result).toEqual(mockUserWithoutPassword)
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(
        hardDeleteUserUseCase.execute('invalid-uuid', mockUser.id, 'admin')
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(mockUserRepository.hardDelete).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const userId = mockUser.id
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockRejectedValue(dbError)

      await expect(
        hardDeleteUserUseCase.execute(userId, userId, 'admin')
      ).rejects.toThrow('Database connection failed')

      expect(mockUserRepository.hardDelete).not.toHaveBeenCalled()
    })
  })
})
