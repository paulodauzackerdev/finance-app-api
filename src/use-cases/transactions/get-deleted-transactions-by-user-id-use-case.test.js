import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { GetDeletedTransactionsByUserIdUseCase } from './get-deleted-transactions-by-user-id-use-case.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetDeletedTransactionsByUserIdUseCase', () => {
  let getDeletedTransactionsByUserIdUseCase
  let mockTransactionRepository
  let mockUserRepository

  const mockUser = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email()
  }

  const mockDeletedTransactions = [
    {
      id: faker.string.uuid(),
      userId: mockUser.id,
      name: 'Salário',
      amount: 5000,
      type: 'income',
      transactionDate: '2026-06-01T00:00:00.000Z',
      deletedAt: new Date('2026-06-30')
    },
    {
      id: faker.string.uuid(),
      userId: mockUser.id,
      name: 'Aluguel',
      amount: 1500,
      type: 'expense',
      transactionDate: '2026-06-05T00:00:00.000Z',
      deletedAt: new Date('2026-06-30')
    }
  ]

  beforeEach(() => {
    mockTransactionRepository = {
      findDeletedByUserId: jest.fn()
    }

    mockUserRepository = {
      findById: jest.fn()
    }

    getDeletedTransactionsByUserIdUseCase =
      new GetDeletedTransactionsByUserIdUseCase(
        mockTransactionRepository,
        mockUserRepository
      )

    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return deleted transactions for a valid user', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.findDeletedByUserId.mockResolvedValue(
        mockDeletedTransactions
      )

      const result = await getDeletedTransactionsByUserIdUseCase.execute(userId)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(
        mockTransactionRepository.findDeletedByUserId
      ).toHaveBeenCalledWith(userId)
      expect(result).toEqual(mockDeletedTransactions)
      expect(result).toHaveLength(2)
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        getDeletedTransactionsByUserIdUseCase.execute(userId)
      ).rejects.toThrow(UserNotFoundError)

      expect(
        mockTransactionRepository.findDeletedByUserId
      ).not.toHaveBeenCalled()
    })

    it('should return empty array when user has no deleted transactions', async () => {
      const userId = faker.string.uuid()

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.findDeletedByUserId.mockResolvedValue([])

      const result = await getDeletedTransactionsByUserIdUseCase.execute(userId)

      expect(
        mockTransactionRepository.findDeletedByUserId
      ).toHaveBeenCalledWith(userId)
      expect(result).toEqual([])
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(
        getDeletedTransactionsByUserIdUseCase.execute('invalid-uuid')
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(
        mockTransactionRepository.findDeletedByUserId
      ).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const userId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.findDeletedByUserId.mockRejectedValue(dbError)

      await expect(
        getDeletedTransactionsByUserIdUseCase.execute(userId)
      ).rejects.toThrow('Database connection failed')
    })
  })
})
