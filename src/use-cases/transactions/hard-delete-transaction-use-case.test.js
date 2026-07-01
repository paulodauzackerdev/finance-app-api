import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { HardDeleteTransactionUseCase } from './hard-delete-transaction-use-case.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('HardDeleteTransactionUseCase', () => {
  let hardDeleteTransactionUseCase
  let mockTransactionRepository

  const mockTransaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: 'Salário',
    amount: 5000,
    type: 'income',
    transactionDate: '2026-06-01T00:00:00.000Z'
  }

  const mockDeletedTransaction = {
    ...mockTransaction,
    deletedAt: new Date('2026-06-30')
  }

  beforeEach(() => {
    mockTransactionRepository = {
      findById: jest.fn(),
      hardDelete: jest.fn()
    }

    hardDeleteTransactionUseCase = new HardDeleteTransactionUseCase(
      mockTransactionRepository
    )

    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should hard delete a transaction successfully', async () => {
      const transactionId = faker.string.uuid()

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction)
      mockTransactionRepository.hardDelete.mockResolvedValue(
        mockDeletedTransaction
      )

      const result = await hardDeleteTransactionUseCase.execute(transactionId)

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId,
        true
      )
      expect(mockTransactionRepository.hardDelete).toHaveBeenCalledWith(
        transactionId
      )
      expect(result).toEqual(mockDeletedTransaction)
    })

    it('should throw TransactionNotFoundError when transaction does not exist', async () => {
      const transactionId = faker.string.uuid()

      mockTransactionRepository.findById.mockResolvedValue(null)

      await expect(
        hardDeleteTransactionUseCase.execute(transactionId)
      ).rejects.toThrow(TransactionNotFoundError)

      expect(mockTransactionRepository.hardDelete).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(
        hardDeleteTransactionUseCase.execute('invalid-uuid')
      ).rejects.toThrow(ZodError)

      expect(mockTransactionRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.hardDelete).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const transactionId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockTransactionRepository.findById.mockRejectedValue(dbError)

      await expect(
        hardDeleteTransactionUseCase.execute(transactionId)
      ).rejects.toThrow('Database connection failed')

      expect(mockTransactionRepository.hardDelete).not.toHaveBeenCalled()
    })
  })
})
