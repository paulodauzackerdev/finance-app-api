jest.mock('../../../prisma/prisma.js', () => {
  const mockTransaction = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    groupBy: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  return {
    prisma: {
      transaction: mockTransaction
    }
  }
})

import { TransactionRepository } from './postgres-transaction-repository.js'
import { prisma } from '../../../prisma/prisma.js'

describe('TransactionRepository', () => {
  let transactionRepository

  beforeEach(() => {
    transactionRepository = new TransactionRepository()
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should find all active transactions by default', async () => {
      const mockTransactions = [{ id: 'uuid-1', name: 'Salary' }]

      prisma.transaction.findMany.mockResolvedValue(mockTransactions)

      const result = await transactionRepository.findAll()

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { transactionDate: 'desc' }
      })
      expect(result).toEqual(mockTransactions)
    })

    it('should include deleted transactions when includeDeleted is true', async () => {
      prisma.transaction.findMany.mockResolvedValue([])

      await transactionRepository.findAll(true)

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { transactionDate: 'desc' }
      })
    })
  })

  describe('findById', () => {
    it('should find active transaction by id', async () => {
      const mockTransaction = { id: 'uuid-1', name: 'Salary' }

      prisma.transaction.findUnique.mockResolvedValue(mockTransaction)

      const result = await transactionRepository.findById('uuid-1')

      expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1', deletedAt: null }
      })
      expect(result).toEqual(mockTransaction)
    })

    it('should include deleted when includeDeleted is true', async () => {
      prisma.transaction.findUnique.mockResolvedValue(null)

      await transactionRepository.findById('uuid-1', true)

      expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' }
      })
    })

    it('should return null when not found', async () => {
      prisma.transaction.findUnique.mockResolvedValue(null)

      const result = await transactionRepository.findById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('should find active transactions by user id', async () => {
      const mockTransactions = [
        { id: 'uuid-1', userId: 'user-1', name: 'Salary' }
      ]

      prisma.transaction.findMany.mockResolvedValue(mockTransactions)

      const result = await transactionRepository.findByUserId('user-1')

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', deletedAt: null },
        orderBy: { transactionDate: 'desc' }
      })
      expect(result).toEqual(mockTransactions)
    })

    it('should include deleted when includeDeleted is true', async () => {
      prisma.transaction.findMany.mockResolvedValue([])

      await transactionRepository.findByUserId('user-1', true)

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { transactionDate: 'desc' }
      })
    })
  })

  describe('getUserBalance', () => {
    it('should calculate balance correctly with all types', async () => {
      prisma.transaction.groupBy.mockResolvedValue([
        { type: 'income', _sum: { amount: 10000 } },
        { type: 'expense', _sum: { amount: 3000 } },
        { type: 'investment', _sum: { amount: 2000 } }
      ])

      const result = await transactionRepository.getUserBalance('user-1')

      expect(prisma.transaction.groupBy).toHaveBeenCalledWith({
        by: ['type'],
        where: { userId: 'user-1', deletedAt: null },
        _sum: { amount: true }
      })
      expect(result).toEqual({
        totalIncome: 10000,
        totalExpense: 3000,
        totalInvestment: 2000,
        balance: 5000
      })
    })

    it('should handle empty result (no transactions)', async () => {
      prisma.transaction.groupBy.mockResolvedValue([])

      const result = await transactionRepository.getUserBalance('user-1')

      expect(result).toEqual({
        totalIncome: 0,
        totalExpense: 0,
        totalInvestment: 0,
        balance: 0
      })
    })

    it('should handle only income', async () => {
      prisma.transaction.groupBy.mockResolvedValue([
        { type: 'income', _sum: { amount: 5000 } }
      ])

      const result = await transactionRepository.getUserBalance('user-1')

      expect(result).toEqual({
        totalIncome: 5000,
        totalExpense: 0,
        totalInvestment: 0,
        balance: 5000
      })
    })

    it('should handle Decimal amounts by converting to Number', async () => {
      prisma.transaction.groupBy.mockResolvedValue([
        { type: 'income', _sum: { amount: '10000.50' } },
        { type: 'expense', _sum: { amount: '2500.25' } }
      ])

      const result = await transactionRepository.getUserBalance('user-1')

      expect(result.totalIncome).toBe(10000.5)
      expect(result.totalExpense).toBe(2500.25)
      expect(result.balance).toBe(7500.25)
    })
  })

  describe('create', () => {
    it('should create a transaction', async () => {
      const transactionData = {
        userId: 'user-1',
        name: 'Salary',
        amount: 5000,
        description: 'Monthly salary',
        type: 'income',
        transactionDate: '2026-06-01T00:00:00.000Z'
      }
      const createdTransaction = { id: 'uuid-1', ...transactionData }

      prisma.transaction.create.mockResolvedValue(createdTransaction)

      const result = await transactionRepository.create(transactionData)

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: transactionData
      })
      expect(result).toEqual(createdTransaction)
    })
  })

  describe('update', () => {
    it('should update transaction with provided fields', async () => {
      const transactionId = 'uuid-1'
      const updateParams = {
        name: 'Updated Salary',
        amount: 6000
      }
      const updatedTransaction = { id: transactionId, ...updateParams }

      prisma.transaction.update.mockResolvedValue(updatedTransaction)

      const result = await transactionRepository.update(
        transactionId,
        updateParams
      )

      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: transactionId, deletedAt: null },
        data: {
          name: 'Updated Salary',
          amount: 6000
        }
      })
      expect(result).toEqual(updatedTransaction)
    })

    it('should handle all updatable fields', async () => {
      const updateParams = {
        userId: 'new-user',
        name: 'New name',
        amount: 100,
        description: 'New desc',
        type: 'expense',
        transactionDate: '2026-07-01T00:00:00.000Z'
      }

      prisma.transaction.update.mockResolvedValue({ id: 'uuid-1' })

      await transactionRepository.update('uuid-1', updateParams)

      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1', deletedAt: null },
        data: updateParams
      })
    })

    it('should skip undefined fields', async () => {
      const updateParams = {
        name: 'Just name'
      }

      prisma.transaction.update.mockResolvedValue({ id: 'uuid-1' })

      await transactionRepository.update('uuid-1', updateParams)

      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1', deletedAt: null },
        data: { name: 'Just name' }
      })
    })
  })

  describe('softDelete', () => {
    it('should set deletedAt', async () => {
      const transactionId = 'uuid-1'

      prisma.transaction.update.mockResolvedValue({
        id: transactionId,
        deletedAt: new Date()
      })

      const result = await transactionRepository.softDelete(transactionId)

      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: transactionId, deletedAt: null },
        data: { deletedAt: expect.any(Date) }
      })
      expect(result.deletedAt).toBeDefined()
    })
  })

  describe('hardDelete', () => {
    it('should delete transaction permanently', async () => {
      const transactionId = 'uuid-1'

      prisma.transaction.delete.mockResolvedValue({ id: transactionId })

      const result = await transactionRepository.hardDelete(transactionId)

      expect(prisma.transaction.delete).toHaveBeenCalledWith({
        where: { id: transactionId }
      })
      expect(result).toEqual({ id: transactionId })
    })
  })

  describe('restore', () => {
    it('should restore soft-deleted transaction', async () => {
      const transactionId = 'uuid-1'
      const restoredTransaction = { id: transactionId, deletedAt: null }

      prisma.transaction.update.mockResolvedValue(restoredTransaction)

      const result = await transactionRepository.restore(transactionId)

      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: transactionId },
        data: { deletedAt: null }
      })
      expect(result).toEqual(restoredTransaction)
    })
  })

  describe('findDeleted', () => {
    it('should find all soft-deleted transactions', async () => {
      const deletedTransactions = [
        { id: 'uuid-1', deletedAt: new Date(), name: 'Deleted' }
      ]

      prisma.transaction.findMany.mockResolvedValue(deletedTransactions)

      const result = await transactionRepository.findDeleted()

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' }
      })
      expect(result).toEqual(deletedTransactions)
    })
  })

  describe('findDeletedByUserId', () => {
    it('should find deleted transactions by user id', async () => {
      const deletedTransactions = [
        {
          id: 'uuid-1',
          userId: 'user-1',
          name: 'Deleted',
          deletedAt: new Date()
        }
      ]

      prisma.transaction.findMany.mockResolvedValue(deletedTransactions)

      const result = await transactionRepository.findDeletedByUserId('user-1')

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' }
      })
      expect(result).toEqual(deletedTransactions)
    })
  })
})
