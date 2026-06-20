import { GetDeletedTransactionsController } from './get-deleted-transactions-controller.js'

describe('GetDeletedTransactionsController', () => {
  it('should return 200 with deleted transactions when successful', async () => {
    // Arrange
    const expectedDeletedTransactions = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        userId: '26009c37-ce06-4406-88fc-ac4de15a32d6',
        name: 'Freelance Payment',
        amount: 5000,
        type: 'income',
        description: 'Payment for web development',
        transactionDate: '2026-06-15T10:00:00.000Z',
        createdAt: '2026-06-15T10:00:00.000Z',
        updatedAt: '2026-06-15T10:00:00.000Z',
        deletedAt: '2026-06-18T22:10:45.488Z'
      },
      {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        userId: '26009c37-ce06-4406-88fc-ac4de15a32d6',
        name: 'Supermarket',
        amount: 250,
        type: 'expense',
        description: 'Weekly groceries',
        transactionDate: '2026-06-14T14:00:00.000Z',
        createdAt: '2026-06-14T14:00:00.000Z',
        updatedAt: '2026-06-14T14:00:00.000Z',
        deletedAt: '2026-06-17T15:20:23.306Z'
      }
    ]

    const getDeletedTransactionsUseCase = {
      execute: jest.fn().mockResolvedValue(expectedDeletedTransactions)
    }

    const controller = new GetDeletedTransactionsController(
      getDeletedTransactionsUseCase
    )

    const req = {}

    const json = jest.fn()

    const res = {
      status: jest.fn().mockReturnValue({
        json
      })
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getDeletedTransactionsUseCase.execute).toHaveBeenCalledWith()
    expect(getDeletedTransactionsUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedDeletedTransactions)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('Database connection failed')

    const getDeletedTransactionsUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new GetDeletedTransactionsController(
      getDeletedTransactionsUseCase
    )

    const req = {}

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getDeletedTransactionsUseCase.execute).toHaveBeenCalledWith()
    expect(getDeletedTransactionsUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
