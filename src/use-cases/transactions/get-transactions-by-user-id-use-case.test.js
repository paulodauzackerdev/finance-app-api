import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id-use-case.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetTransactionsByUserIdUseCase', () => {
  let getTransactionsByUserIdUseCase
  let mockTransactionRepository
  let mockUserRepository

  const mockUser = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email()
  }

  const mockTransactions = [
    {
      id: faker.string.uuid(),
      userId: mockUser.id,
      name: 'Salário',
      amount: 5000,
      type: 'income',
      transactionDate: '2026-06-01T00:00:00.000Z'
    },
    {
      id: faker.string.uuid(),
      userId: mockUser.id,
      name: 'Aluguel',
      amount: 1500,
      type: 'expense',
      transactionDate: '2026-06-05T00:00:00.000Z'
    }
  ]

  beforeEach(() => {
    mockTransactionRepository = {
      findByUserId: jest.fn()
    }

    mockUserRepository = {
      findById: jest.fn()
    }

    getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
      mockTransactionRepository,
      mockUserRepository
    )

    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return transactions for a valid user', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.findByUserId.mockResolvedValue(mockTransactions)

      const result = await getTransactionsByUserIdUseCase.execute(userId)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockTransactionRepository.findByUserId).toHaveBeenCalledWith(
        userId
      )
      expect(result).toEqual(mockTransactions)
      expect(result).toHaveLength(2)
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        getTransactionsByUserIdUseCase.execute(userId)
      ).rejects.toThrow(UserNotFoundError)

      expect(mockTransactionRepository.findByUserId).not.toHaveBeenCalled()
    })

    it('should return empty array when user has no transactions', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.findByUserId.mockResolvedValue([])

      const result = await getTransactionsByUserIdUseCase.execute(userId)

      expect(mockTransactionRepository.findByUserId).toHaveBeenCalledWith(
        userId
      )
      expect(result).toEqual([])
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(
        getTransactionsByUserIdUseCase.execute('invalid-uuid')
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.findByUserId).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const userId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.findByUserId.mockRejectedValue(dbError)

      await expect(
        getTransactionsByUserIdUseCase.execute(userId)
      ).rejects.toThrow('Database connection failed')
    })
  })
})
