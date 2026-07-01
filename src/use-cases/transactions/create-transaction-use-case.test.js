import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { CreateTransactionUseCase } from './create-transaction-use-case.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('CreateTransactionUseCase', () => {
  let createTransactionUseCase
  let mockTransactionRepository
  let mockUserRepository

  const validParams = {
    userId: faker.string.uuid(),
    name: 'Salário',
    amount: 5000,
    description: 'Salário mensal',
    type: 'income',
    transactionDate: '2026-06-01T00:00:00.000Z'
  }

  const createdTransaction = {
    id: faker.string.uuid(),
    ...validParams
  }

  const mockUser = {
    id: validParams.userId,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email()
  }

  beforeEach(() => {
    mockTransactionRepository = {
      create: jest.fn()
    }

    mockUserRepository = {
      findById: jest.fn()
    }

    createTransactionUseCase = new CreateTransactionUseCase(
      mockTransactionRepository,
      mockUserRepository
    )

    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should create a transaction successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.create.mockResolvedValue(createdTransaction)

      const result = await createTransactionUseCase.execute(validParams)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        validParams.userId
      )
      expect(mockTransactionRepository.create).toHaveBeenCalledWith({
        userId: validParams.userId,
        name: validParams.name,
        amount: validParams.amount,
        description: validParams.description,
        type: validParams.type,
        transactionDate: validParams.transactionDate
      })
      expect(result).toEqual(createdTransaction)
    })

    it('should throw UserNotFoundError when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        createTransactionUseCase.execute(validParams)
      ).rejects.toThrow(UserNotFoundError)

      expect(mockTransactionRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ZodError for missing required fields', async () => {
      const invalidParams = {
        name: 'Salário'
      }

      await expect(
        createTransactionUseCase.execute(invalidParams)
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid amount (negative)', async () => {
      const invalidParams = {
        ...validParams,
        amount: -100
      }

      await expect(
        createTransactionUseCase.execute(invalidParams)
      ).rejects.toThrow(ZodError)

      expect(mockTransactionRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid type', async () => {
      const invalidParams = {
        ...validParams,
        type: 'invalid-type'
      }

      await expect(
        createTransactionUseCase.execute(invalidParams)
      ).rejects.toThrow(ZodError)

      expect(mockTransactionRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ZodError for invalid userId UUID', async () => {
      const invalidParams = {
        ...validParams,
        userId: 'not-a-uuid'
      }

      await expect(
        createTransactionUseCase.execute(invalidParams)
      ).rejects.toThrow(ZodError)

      expect(mockUserRepository.findById).not.toHaveBeenCalled()
      expect(mockTransactionRepository.create).not.toHaveBeenCalled()
    })

    it('should propagate error if repository fails', async () => {
      const dbError = new Error('Database connection failed')

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockTransactionRepository.create.mockRejectedValue(dbError)

      await expect(
        createTransactionUseCase.execute(validParams)
      ).rejects.toThrow('Database connection failed')
    })
  })
})
