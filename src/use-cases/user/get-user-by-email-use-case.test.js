import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { GetUserByEmailUseCase } from './get-user-by-email-use-case.js'
import { removePasswordFromUser } from '../../helpers/user.js'
import { UserNotFoundError } from '../../errors/user.js'

jest.mock('../../helpers/user.js', () => ({
  removePasswordFromUser: jest.fn()
}))

describe('GetUserByEmailUseCase', () => {
  let getUserByEmailUseCase
  let mockUserRepository

  const mockUser = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: 'joao@email.com',
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
      findByEmail: jest.fn()
    }

    getUserByEmailUseCase = new GetUserByEmailUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should return user without password', async () => {
      const email = 'joao@email.com'

      mockUserRepository.findByEmail.mockResolvedValue(mockUser)
      removePasswordFromUser.mockReturnValue(mockUserWithoutPassword)

      const result = await getUserByEmailUseCase.execute(email)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(removePasswordFromUser).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(mockUserWithoutPassword)
      expect(result).not.toHaveProperty('passwordHash')
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      const email = 'naoexiste@email.com'

      mockUserRepository.findByEmail.mockResolvedValue(null)

      await expect(getUserByEmailUseCase.execute(email)).rejects.toThrow(
        UserNotFoundError
      )

      expect(removePasswordFromUser).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid email', async () => {
      await expect(
        getUserByEmailUseCase.execute('invalid-email')
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled()
      expect(removePasswordFromUser).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const email = 'joao@email.com'
      const dbError = new Error('Database connection failed')

      mockUserRepository.findByEmail.mockRejectedValue(dbError)

      await expect(getUserByEmailUseCase.execute(email)).rejects.toThrow(
        'Database connection failed'
      )

      expect(removePasswordFromUser).not.toHaveBeenCalled()
    })
  })
})
