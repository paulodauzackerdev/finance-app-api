import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { UpdateTransactionUseCase } from './update-transaction-use-case.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('UpdateTransactionUseCase', () => {
  let updateTransactionUseCase
  let mockTransactionRepository
  const authenticatedUserId = faker.string.uuid()

  const mockExistingTransaction = {
    id: faker.string.uuid(),
    userId: authenticatedUserId,
    name: 'Salário',
    amount: 5000,
    description: 'Salário mensal',
    type: 'income',
    transactionDate: '2026-06-01T00:00:00.000Z'
  }

  beforeEach(() => {
    mockTransactionRepository = {
      findById: jest.fn(),
      update: jest.fn()
    }

    updateTransactionUseCase = new UpdateTransactionUseCase(
      mockTransactionRepository
    )
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should update transaction name successfully', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = { name: 'Salário atualizado' }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockResolvedValue({
        ...mockExistingTransaction,
        name: 'Salário atualizado'
      })

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId
      )
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { name: 'Salário atualizado' }
      )
      expect(result.name).toBe('Salário atualizado')
    })

    it('should throw TransactionNotFoundError when transaction does not exist', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = { name: 'Novo nome' }

      mockTransactionRepository.findById.mockResolvedValue(null)

      await expect(
        updateTransactionUseCase.execute(
          transactionId,
          authenticatedUserId,
          updateParams
        )
      ).rejects.toThrow(TransactionNotFoundError)

      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
    })

    it('should return same transaction without updating when no fields changed', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = {
        name: mockExistingTransaction.name,
        type: mockExistingTransaction.type
      }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingTransaction))
    })

    it('should update amount successfully', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = { amount: 6000 }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockResolvedValue({
        ...mockExistingTransaction,
        amount: 6000
      })

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { amount: 6000 }
      )
      expect(result.amount).toBe(6000)
    })

    it('should skip amount when value is the same (handling Number vs Decimal)', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = { amount: 5000 }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingTransaction))
    })

    it('should update transactionDate successfully', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = {
        transactionDate: '2026-07-01T00:00:00.000Z'
      }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockResolvedValue({
        ...mockExistingTransaction,
        transactionDate: '2026-07-01T00:00:00.000Z'
      })

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { transactionDate: '2026-07-01T00:00:00.000Z' }
      )
      expect(result.transactionDate).toBe('2026-07-01T00:00:00.000Z')
    })

    it('should skip transactionDate when value is the same (ISO compared correctly)', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = {
        transactionDate: '2026-06-01T00:00:00.000Z'
      }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingTransaction))
    })

    it('should update description to null', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = { description: null }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockResolvedValue({
        ...mockExistingTransaction,
        description: null
      })

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { description: null }
      )
      expect(result.description).toBeNull()
    })

    it('should update multiple fields simultaneously', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = {
        name: 'Novo nome',
        amount: 9999.99,
        type: 'expense'
      }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockResolvedValue({
        ...mockExistingTransaction,
        ...updateParams
      })

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        {
          name: 'Novo nome',
          amount: 9999.99,
          type: 'expense'
        }
      )
      expect(result.name).toBe('Novo nome')
      expect(result.amount).toBe(9999.99)
      expect(result.type).toBe('expense')
    })

    it('should skip fields that did not change in multi-field update (OCP - auto diff)', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = {
        name: mockExistingTransaction.name,
        amount: 5000,
        type: mockExistingTransaction.type
      }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingTransaction))
    })

    it('should throw ZodError for invalid UUID', async () => {
      const invalidId = 'not-a-uuid'
      const updateParams = { name: 'Teste' }

      await expect(
        updateTransactionUseCase.execute(
          invalidId,
          authenticatedUserId,
          updateParams
        )
      ).rejects.toThrow(ZodError)

      expect(mockTransactionRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
    })

    it('should throw ZodError for empty input', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = {}

      await expect(
        updateTransactionUseCase.execute(
          transactionId,
          authenticatedUserId,
          updateParams
        )
      ).rejects.toThrow(ZodError)

      expect(mockTransactionRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
    })

    it('should update transactionDate when existing transaction has no date', async () => {
      const transactionId = mockExistingTransaction.id
      const noDateTransaction = {
        ...mockExistingTransaction,
        transactionDate: null
      }
      const updateParams = {
        transactionDate: '2026-07-01T00:00:00.000Z'
      }

      mockTransactionRepository.findById.mockResolvedValue(noDateTransaction)
      mockTransactionRepository.update.mockResolvedValue({
        ...noDateTransaction,
        transactionDate: '2026-07-01T00:00:00.000Z'
      })

      const result = await updateTransactionUseCase.execute(
        transactionId,
        authenticatedUserId,
        updateParams
      )

      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { transactionDate: '2026-07-01T00:00:00.000Z' }
      )
      expect(result.transactionDate).toBe('2026-07-01T00:00:00.000Z')
    })

    it('should propagate error if repository fails', async () => {
      const transactionId = mockExistingTransaction.id
      const updateParams = { name: 'Novo nome' }
      const dbError = new Error('Database connection failed')

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockRejectedValue(dbError)

      await expect(
        updateTransactionUseCase.execute(
          transactionId,
          authenticatedUserId,
          updateParams
        )
      ).rejects.toThrow('Database connection failed')
    })
  })
})
