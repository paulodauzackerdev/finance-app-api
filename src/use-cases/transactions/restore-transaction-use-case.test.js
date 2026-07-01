import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { RestoreTransactionUseCase } from './restore-transaction-use-case.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('RestoreTransactionUseCase', () => {
  let restoreTransactionUseCase
  let mockTransactionRepository

  const mockDeletedTransaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: 'Salário',
    amount: 5000,
    type: 'income',
    transactionDate: '2026-06-01T00:00:00.000Z',
    deletedAt: new Date('2026-06-30')
  }

  const mockRestoredTransaction = {
    ...mockDeletedTransaction,
    deletedAt: null
  }

  beforeEach(() => {
    mockTransactionRepository = {
      findById: jest.fn(),
      restore: jest.fn()
    }

    restoreTransactionUseCase = new RestoreTransactionUseCase(
      mockTransactionRepository
    )

    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should restore a transaction successfully', async () => {
      const transactionId = faker.string.uuid()

      mockTransactionRepository.findById.mockResolvedValue(
        mockDeletedTransaction
      )
      mockTransactionRepository.restore.mockResolvedValue(
        mockRestoredTransaction
      )

      const result = await restoreTransactionUseCase.execute(transactionId)

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId,
        true
      )
      expect(mockTransactionRepository.restore).toHaveBeenCalledWith(
        transactionId
      )
      expect(result).toEqual(mockRestoredTransaction)
      expect(result.deletedAt).toBeNull()
    })

    it('should throw TransactionNotFoundError when transaction does not exist', async () => {
      const transactionId = faker.string.uuid()

      mockTransactionRepository.findById.mockResolvedValue(null)

      await expect(
        restoreTransactionUseCase.execute(transactionId)
      ).rejects.toThrow(TransactionNotFoundError)

      expect(mockTransactionRepository.restore).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(
        restoreTransactionUseCase.execute('invalid-uuid')
      ).rejects.toThrow(ZodError)

      expect(mockTransactionRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.restore).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const transactionId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockTransactionRepository.findById.mockRejectedValue(dbError)

      await expect(
        restoreTransactionUseCase.execute(transactionId)
      ).rejects.toThrow('Database connection failed')

      expect(mockTransactionRepository.restore).not.toHaveBeenCalled()
    })
  })
})
