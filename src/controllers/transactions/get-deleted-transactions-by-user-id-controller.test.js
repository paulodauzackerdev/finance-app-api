import { GetDeletedTransactionsByUserIdController } from './get-deleted-transactions-by-user-id-controller.js'

describe('GetDeletedTransactionsByUserIdController', () => {
  it('should return 200 with deleted transactions by user id when successful', async () => {
    // Arrange
    const expectedTransactions = [
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
      }
    ]

    const getDeletedTransactionsByUserIdUseCase = {
      execute: jest.fn().mockResolvedValue(expectedTransactions)
    }

    const controller = new GetDeletedTransactionsByUserIdController(
      getDeletedTransactionsByUserIdUseCase
    )

    const req = {
      params: {
        userId: '26009c37-ce06-4406-88fc-ac4de15a32d6'
      }
    }

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
    expect(getDeletedTransactionsByUserIdUseCase.execute).toHaveBeenCalledWith(
      '26009c37-ce06-4406-88fc-ac4de15a32d6'
    )
    expect(getDeletedTransactionsByUserIdUseCase.execute).toHaveBeenCalledTimes(
      1
    )

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedTransactions)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('Database connection failed')

    const getDeletedTransactionsByUserIdUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new GetDeletedTransactionsByUserIdController(
      getDeletedTransactionsByUserIdUseCase
    )

    const req = {
      params: {
        userId: '26009c37-ce06-4406-88fc-ac4de15a32d6'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getDeletedTransactionsByUserIdUseCase.execute).toHaveBeenCalledWith(
      '26009c37-ce06-4406-88fc-ac4de15a32d6'
    )
    expect(getDeletedTransactionsByUserIdUseCase.execute).toHaveBeenCalledTimes(
      1
    )

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
