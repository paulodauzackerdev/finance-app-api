import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { SoftDeleteTransactionUseCase } from './soft-delete-transaction-use-case.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('SoftDeleteTransactionUseCase', () => {
  let softDeleteTransactionUseCase
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
      softDelete: jest.fn()
    }

    softDeleteTransactionUseCase = new SoftDeleteTransactionUseCase(
      mockTransactionRepository
    )

    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should soft delete a transaction successfully', async () => {
      const transactionId = faker.string.uuid()

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction)
      mockTransactionRepository.softDelete.mockResolvedValue(
        mockDeletedTransaction
      )

      const result = await softDeleteTransactionUseCase.execute(transactionId)

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId
      )
      expect(mockTransactionRepository.softDelete).toHaveBeenCalledWith(
        transactionId
      )
      expect(result).toEqual(mockDeletedTransaction)
    })

    it('should throw TransactionNotFoundError when transaction does not exist', async () => {
      const transactionId = faker.string.uuid()

      mockTransactionRepository.findById.mockResolvedValue(null)

      await expect(
        softDeleteTransactionUseCase.execute(transactionId)
      ).rejects.toThrow(TransactionNotFoundError)

      expect(mockTransactionRepository.softDelete).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid UUID', async () => {
      await expect(
        softDeleteTransactionUseCase.execute('invalid-uuid')
      ).rejects.toThrow(ZodError)

      expect(mockTransactionRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.softDelete).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const transactionId = faker.string.uuid()
      const dbError = new Error('Database connection failed')

      mockTransactionRepository.findById.mockRejectedValue(dbError)

      await expect(
        softDeleteTransactionUseCase.execute(transactionId)
      ).rejects.toThrow('Database connection failed')

      expect(mockTransactionRepository.softDelete).not.toHaveBeenCalled()
    })
  })
})
