import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { GetUserByIdUseCase } from './get-user-by-id-use-case.js'
import { removePasswordFromUser } from '../../helpers/user.js'
import {
  UserNotFoundError,
  ForbiddenUserAccessError
} from '../../errors/user.js'

jest.mock('../../helpers/user.js', () => ({
  removePasswordFromUser: jest.fn()
}))

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase
  let mockUserRepository

  const mockUser = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    passwordHash: 'hashed_password'
  }

  const mockUserWithoutPassword = {
    id: mockUser.id,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUserRepository = {
      findById: jest.fn()
    }

    getUserByIdUseCase = new GetUserByIdUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should return user without password when accessing own data', async () => {
      const userId = mockUser.id

      mockUserRepository.findById.mockResolvedValue(mockUser)
      removePasswordFromUser.mockReturnValue(mockUserWithoutPassword)

      const result = await getUserByIdUseCase.execute(userId, userId, 'user')

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(removePasswordFromUser).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(mockUserWithoutPassword)
      expect(result).not.toHaveProperty('passwordHash')
    })

    it('should return user when admin accesses any user', async () => {
      const userId = mockUser.id
      const otherUserId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(mockUser)
      removePasswordFromUser.mockReturnValue(mockUserWithoutPassword)

      const result = await getUserByIdUseCase.execute(
        userId,
        otherUserId,
        'admin'
      )

      expect(result).toEqual(mockUserWithoutPassword)
    })

    it('should throw ForbiddenUserAccessError when accessing another user data', async () => {
      const userId = faker.string.uuid()
      const otherUserId = faker.string.uuid()

      await expect(
        getUserByIdUseCase.execute(userId, otherUserId, 'user')
      ).rejects.toThrow(ForbiddenUserAccessError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        getUserByIdUseCase.execute(userId, userId, 'user')
      ).rejects.toThrow(UserNotFoundError)

      expect(removePasswordFromUser).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(
        getUserByIdUseCase.execute('invalid-uuid', 'any-id', 'user')
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(removePasswordFromUser).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const userId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockRejectedValue(dbError)

      await expect(
        getUserByIdUseCase.execute(userId, userId, 'user')
      ).rejects.toThrow('Database connection failed')

      expect(removePasswordFromUser).not.toHaveBeenCalled()
    })
  })
})
