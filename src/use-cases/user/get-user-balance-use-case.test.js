import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { GetUserBalanceUseCase } from '../user/get-user-balance-use-case.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetUserBalanceUseCase', () => {
  let getUserBalanceUseCase
  let mockTransactionRepository
  let mockUserRepository
  const authenticatedUserId = faker.string.uuid()
  const authenticatedUserRole = 'user'

  const mockUser = {
    id: authenticatedUserId,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email()
  }

  const mockBalance = {
    totalIncome: 5000,
    totalExpense: 1000,
    totalInvestment: 500,
    balance: 3500
  }

  beforeEach(() => {
    mockTransactionRepository = {
      getUserBalance: jest.fn()
    }

    mockUserRepository = {
      findById: jest.fn()
    }

    getUserBalanceUseCase = new GetUserBalanceUseCase(
      mockTransactionRepository,
      mockUserRepository
    )

    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should get user balance successfully', async () => {
      const userId = authenticatedUserId

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.getUserBalance.mockResolvedValue(mockBalance)

      const result = await getUserBalanceUseCase.execute(
        userId,
        authenticatedUserId,
        authenticatedUserRole
      )

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockTransactionRepository.getUserBalance).toHaveBeenCalledWith(
        userId
      )
      expect(result.userId).toBe(userId)
      expect(result.userName).toBe(`${mockUser.firstName} ${mockUser.lastName}`)
      expect(result.userEmail).toBe(mockUser.email)
      expect(result.balance).toEqual(mockBalance)
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        getUserBalanceUseCase.execute(userId, userId, 'admin')
      ).rejects.toThrow(UserNotFoundError)

      expect(mockTransactionRepository.getUserBalance).not.toHaveBeenCalled()
    })

    it('should throw ZodError if invalid userId is provided', async () => {
      await expect(
        getUserBalanceUseCase.execute(
          'invalid-uuid',
          authenticatedUserId,
          authenticatedUserRole
        )
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.getUserBalance).not.toHaveBeenCalled()
    })

    it('should throw if user repository fails', async () => {
      const userId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockRejectedValue(dbError)

      await expect(
        getUserBalanceUseCase.execute(userId, userId, 'admin')
      ).rejects.toThrow('Database connection failed')

      expect(mockTransactionRepository.getUserBalance).not.toHaveBeenCalled()
    })

    it('should throw if transaction repository fails', async () => {
      const userId = authenticatedUserId
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.getUserBalance.mockRejectedValue(dbError)

      await expect(
        getUserBalanceUseCase.execute(
          userId,
          authenticatedUserId,
          authenticatedUserRole
        )
      ).rejects.toThrow('Database connection failed')

      expect(mockUserRepository.findById).toHaveBeenCalled()
      expect(mockTransactionRepository.getUserBalance).toHaveBeenCalled()
    })
  })
})
