import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { SoftDeleteUserUseCase } from './soft-delete-user-use-case.js'
import { removePasswordFromUser } from '../../helpers/user.js'
import {
  UserNotFoundError,
  ForbiddenUserDeletionError
} from '../../errors/user.js'

jest.mock('../../helpers/user.js', () => ({
  removePasswordFromUser: jest.fn()
}))

describe('SoftDeleteUserUseCase', () => {
  let softDeleteUserUseCase
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
      softDelete: jest.fn()
    }

    softDeleteUserUseCase = new SoftDeleteUserUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should soft delete a user successfully', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.softDelete.mockResolvedValue(mockDeletedUser)
      removePasswordFromUser.mockReturnValue(mockUserWithoutPassword)

      const result = await softDeleteUserUseCase.execute(userId)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.softDelete).toHaveBeenCalledWith(userId)
      expect(removePasswordFromUser).toHaveBeenCalledWith(mockDeletedUser)
      expect(result).toEqual(mockUserWithoutPassword)
      expect(result).not.toHaveProperty('passwordHash')
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(softDeleteUserUseCase.execute(userId)).rejects.toThrow(
        UserNotFoundError
      )

      expect(mockUserRepository.softDelete).not.toHaveBeenCalled()
    })

    it('should throw ForbiddenUserDeletionError when trying to delete admin user', async () => {
      const adminUserId = faker.string.uuid()
      const adminUser = { ...mockUser, id: adminUserId }

      process.env.ADMIN_USER_ID = adminUserId
      mockUserRepository.findById.mockResolvedValue(adminUser)

      await expect(softDeleteUserUseCase.execute(adminUserId)).rejects.toThrow(
        ForbiddenUserDeletionError
      )

      expect(mockUserRepository.softDelete).not.toHaveBeenCalled()

      delete process.env.ADMIN_USER_ID
    })

    it('should throw UserNotFoundError when softDelete returns null', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.softDelete.mockResolvedValue(null)

      await expect(softDeleteUserUseCase.execute(userId)).rejects.toThrow(
        UserNotFoundError
      )

      expect(mockUserRepository.softDelete).toHaveBeenCalledWith(userId)
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(
        softDeleteUserUseCase.execute('invalid-uuid')
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(mockUserRepository.softDelete).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const userId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockRejectedValue(dbError)

      await expect(softDeleteUserUseCase.execute(userId)).rejects.toThrow(
        'Database connection failed'
      )

      expect(mockUserRepository.softDelete).not.toHaveBeenCalled()
    })
  })
})
