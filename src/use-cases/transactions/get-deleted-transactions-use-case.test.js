import { faker } from '@faker-js/faker'
import { GetDeletedTransactionsUseCase } from './get-deleted-transactions-use-case.js'

describe('GetDeletedTransactionsUseCase', () => {
  let getDeletedTransactionsUseCase
  let mockTransactionRepository

  const mockDeletedTransactions = [
    {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      name: 'Salário',
      amount: 5000,
      type: 'income',
      transactionDate: '2026-06-01T00:00:00.000Z',
      deletedAt: new Date('2026-06-30')
    },
    {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      name: 'Aluguel',
      amount: 1500,
      type: 'expense',
      transactionDate: '2026-06-05T00:00:00.000Z',
      deletedAt: new Date('2026-06-30')
    }
  ]

  beforeEach(() => {
    mockTransactionRepository = {
      findDeleted: jest.fn()
    }

    getDeletedTransactionsUseCase = new GetDeletedTransactionsUseCase(
      mockTransactionRepository
    )

    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return all deleted transactions', async () => {
      mockTransactionRepository.findDeleted.mockResolvedValue(
        mockDeletedTransactions
      )

      const result = await getDeletedTransactionsUseCase.execute()

      expect(mockTransactionRepository.findDeleted).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockDeletedTransactions)
      expect(result).toHaveLength(2)
    })

    it('should return an empty array when there are no deleted transactions', async () => {
      mockTransactionRepository.findDeleted.mockResolvedValue([])

      const result = await getDeletedTransactionsUseCase.execute()

      expect(mockTransactionRepository.findDeleted).toHaveBeenCalledTimes(1)
      expect(result).toEqual([])
    })

    it('should throw when the repository fails', async () => {
      const error = new Error('Database error')
      mockTransactionRepository.findDeleted.mockRejectedValue(error)

      await expect(getDeletedTransactionsUseCase.execute()).rejects.toThrow(
        error
      )

      expect(mockTransactionRepository.findDeleted).toHaveBeenCalledTimes(1)
    })
  })
})
