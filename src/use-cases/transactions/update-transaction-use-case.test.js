import { UpdateTransactionUseCase } from './update-transaction-use-case.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('UpdateTransactionUseCase', () => {
  let updateTransactionUseCase
  let mockTransactionRepository

  const mockExistingTransaction = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '550e8400-e29b-41d4-a716-446655440000',
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
    test('deve atualizar nome da transação com sucesso', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = { name: 'Salário atualizado' }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockResolvedValue({
        ...mockExistingTransaction,
        name: 'Salário atualizado'
      })

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId
      )
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { name: 'Salário atualizado' }
      )
      expect(result.name).toBe('Salário atualizado')
    })

    test('deve lançar TransactionNotFoundError quando transação não existe', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = { name: 'Novo nome' }

      mockTransactionRepository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(
        updateTransactionUseCase.execute(transactionId, updateParams)
      ).rejects.toThrow(TransactionNotFoundError)

      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
    })

    test('deve retornar a mesma transação sem atualizar quando nenhum campo mudou', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = {
        name: mockExistingTransaction.name,
        type: mockExistingTransaction.type
      }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingTransaction))
    })

    test('deve atualizar amount com sucesso', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = { amount: 6000 }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockResolvedValue({
        ...mockExistingTransaction,
        amount: 6000
      })

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { amount: 6000 }
      )
      expect(result.amount).toBe(6000)
    })

    test('deve pular amount quando o valor é o mesmo (lidando com Number vs Decimal)', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = { amount: 5000 }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingTransaction))
    })

    test('deve atualizar transactionDate com sucesso', async () => {
      // Arrange
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

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { transactionDate: '2026-07-01T00:00:00.000Z' }
      )
      expect(result.transactionDate).toBe('2026-07-01T00:00:00.000Z')
    })

    test('deve pular transactionDate quando o valor é o mesmo (ISO comparado corretamente)', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = {
        transactionDate: '2026-06-01T00:00:00.000Z'
      }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingTransaction))
    })

    test('deve atualizar descrição para null', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = { description: null }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockResolvedValue({
        ...mockExistingTransaction,
        description: null
      })

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        transactionId,
        { description: null }
      )
      expect(result.description).toBeNull()
    })

    test('deve atualizar múltiplos campos simultaneamente', async () => {
      // Arrange
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

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
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

    test('deve pular campos que não mudaram em atualização múltipla (OCP - diff automático)', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = {
        name: mockExistingTransaction.name,
        amount: 5000,
        type: mockExistingTransaction.type
      }

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )

      // Act
      const result = await updateTransactionUseCase.execute(
        transactionId,
        updateParams
      )

      // Assert
      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
      expect(result).toEqual(expect.objectContaining(mockExistingTransaction))
    })

    test('deve validar UUID inválido com Zod', async () => {
      // Arrange
      const invalidId = 'not-a-uuid'
      const updateParams = { name: 'Teste' }

      // Act & Assert
      await expect(
        updateTransactionUseCase.execute(invalidId, updateParams)
      ).rejects.toThrow() // ZodError

      expect(mockTransactionRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
    })

    test('deve validar input vazio com Zod', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = {}

      // Act & Assert
      await expect(
        updateTransactionUseCase.execute(transactionId, updateParams)
      ).rejects.toThrow() // ZodError (at least one field)

      expect(mockTransactionRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.update).not.toHaveBeenCalled()
    })

    test('deve propagar erro se o repositório falhar', async () => {
      // Arrange
      const transactionId = mockExistingTransaction.id
      const updateParams = { name: 'Novo nome' }
      const dbError = new Error('Database connection failed')

      mockTransactionRepository.findById.mockResolvedValue(
        mockExistingTransaction
      )
      mockTransactionRepository.update.mockRejectedValue(dbError)

      // Act & Assert
      await expect(
        updateTransactionUseCase.execute(transactionId, updateParams)
      ).rejects.toThrow('Database connection failed')
    })
  })
})
