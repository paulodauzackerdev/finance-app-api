import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { UpdateUserUseCase } from './update-user-use-case.js'
import { passwordHelper } from '../../helpers/password.js'
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  UserDeletedError
} from '../../errors/user.js'

jest.mock('../../helpers/password.js', () => ({
  passwordHelper: {
    hash: jest.fn()
  }
}))

describe('UpdateUserUseCase', () => {
  let updateUserUseCase
  let mockUserRepository
  const authenticatedUserId = faker.string.uuid()
  const authenticatedUserRole = 'user'

  const mockExistingUser = {
    id: authenticatedUserId,
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@email.com'
  }

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn()
    }

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository)
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should update user name successfully', async () => {
      const userId = mockExistingUser.id
      const updateParams = { firstName: 'João Carlos' }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.update.mockResolvedValue({
        ...mockExistingUser,
        firstName: 'João Carlos'
      })

      const result = await updateUserUseCase.execute(
        userId,
        updateParams,
        authenticatedUserId,
        authenticatedUserRole
      )

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        firstName: 'João Carlos'
      })
      expect(result.firstName).toBe('João Carlos')
      expect(result.passwordHash).toBeUndefined()
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = mockExistingUser.id
      const updateParams = { firstName: 'Novo Nome' }

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        updateUserUseCase.execute(
          userId,
          updateParams,
          authenticatedUserId,
          authenticatedUserRole
        )
      ).rejects.toThrow(UserNotFoundError)
    })

    it('should throw UserAlreadyExistsError when email conflicts with another user', async () => {
      const userId = mockExistingUser.id
      const updateParams = { email: 'novo@email.com' }
      const anotherUser = { id: faker.string.uuid(), email: 'novo@email.com' }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.findByEmail.mockResolvedValue(anotherUser)

      await expect(
        updateUserUseCase.execute(
          userId,
          updateParams,
          authenticatedUserId,
          authenticatedUserRole
        )
      ).rejects.toThrow(UserAlreadyExistsError)
    })

    it('should throw UserDeletedError when email exists but is soft-deleted', async () => {
      const userId = mockExistingUser.id
      const updateParams = { email: 'deletado@email.com' }
      const deletedUser = {
        id: faker.string.uuid(),
        email: 'deletado@email.com',
        deletedAt: new Date('2026-06-01')
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.findByEmail.mockResolvedValue(deletedUser)

      await expect(
        updateUserUseCase.execute(
          userId,
          updateParams,
          authenticatedUserId,
          authenticatedUserRole
        )
      ).rejects.toThrow(UserDeletedError)
    })

    it('should update password with hash', async () => {
      const userId = mockExistingUser.id
      const updateParams = { password: 'NovaSenha123!' }
      const hashedPassword = 'hashed_password_123'

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      passwordHelper.hash.mockResolvedValue(hashedPassword)
      mockUserRepository.update.mockResolvedValue(mockExistingUser)

      await updateUserUseCase.execute(
        userId,
        updateParams,
        authenticatedUserId,
        authenticatedUserRole
      )

      expect(passwordHelper.hash).toHaveBeenCalledWith('NovaSenha123!')
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        passwordHash: hashedPassword
      })
    })

    it('should return same user without updating when no fields changed', async () => {
      const userId = mockExistingUser.id
      const updateParams = {
        firstName: mockExistingUser.firstName,
        email: mockExistingUser.email
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)

      const result = await updateUserUseCase.execute(
        userId,
        updateParams,
        authenticatedUserId,
        authenticatedUserRole
      )

      expect(mockUserRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(
        expect.objectContaining({
          firstName: mockExistingUser.firstName,
          email: mockExistingUser.email
        })
      )
    })

    it('should throw ZodError for invalid UUID', async () => {
      const invalidUserId = 'not-a-uuid'
      const updateParams = { firstName: 'Teste' }

      await expect(
        updateUserUseCase.execute(
          invalidUserId,
          updateParams,
          authenticatedUserId,
          authenticatedUserRole
        )
      ).rejects.toThrow(ZodError)
    })

    it('should throw ZodError for empty input', async () => {
      const userId = mockExistingUser.id
      const updateParams = {}

      await expect(
        updateUserUseCase.execute(
          userId,
          updateParams,
          authenticatedUserId,
          authenticatedUserRole
        )
      ).rejects.toThrow(ZodError)
    })

    it('should skip fields that did not change even when sent (OCP - auto diff)', async () => {
      const userId = mockExistingUser.id
      const updateParams = {
        firstName: mockExistingUser.firstName,
        lastName: mockExistingUser.lastName,
        email: mockExistingUser.email
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)

      const result = await updateUserUseCase.execute(
        userId,
        updateParams,
        authenticatedUserId,
        authenticatedUserRole
      )

      expect(mockUserRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingUser))
    })

    it('should update multiple fields simultaneously', async () => {
      const userId = mockExistingUser.id
      const updateParams = {
        firstName: 'Carlos',
        lastName: 'Santos',
        email: 'carlos@email.com'
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.update.mockResolvedValue({
        ...mockExistingUser,
        ...updateParams
      })

      const result = await updateUserUseCase.execute(
        userId,
        updateParams,
        authenticatedUserId,
        authenticatedUserRole
      )

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        firstName: 'Carlos',
        lastName: 'Santos',
        email: 'carlos@email.com'
      })
      expect(result.firstName).toBe('Carlos')
      expect(result.lastName).toBe('Santos')
      expect(result.email).toBe('carlos@email.com')
    })

    it('should propagate error if repository fails', async () => {
      const userId = mockExistingUser.id
      const updateParams = { firstName: 'Novo Nome' }
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.update.mockRejectedValue(dbError)

      await expect(
        updateUserUseCase.execute(
          userId,
          updateParams,
          authenticatedUserId,
          authenticatedUserRole
        )
      ).rejects.toThrow('Database connection failed')
    })
  })
})
