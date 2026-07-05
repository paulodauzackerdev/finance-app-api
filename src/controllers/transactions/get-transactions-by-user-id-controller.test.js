import { GetTransactionsByUserIdController } from './get-transactions-by-user-id-controller.js'

describe('GetTransactionsByUserIdController', () => {
  it('should return 200 when transactions are retrieved successfully', async () => {
    // Arrange
    const expectedTransactions = [
      {
        id: '35504dde-6b4e-4d0e-a84e-854800175083',
        userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
        name: 'Transação 1',
        amount: '3500.58',
        description: 'Descrição teste',
        type: 'expense',
        transactionDate: '2026-06-03T15:30:00.000Z',
        createdAt: '2026-06-19T12:17:20.763Z',
        updatedAt: '2026-06-19T12:17:20.763Z',
        deletedAt: null
      },
      {
        id: 'c00da004-894a-4f25-b810-cd2226b29857',
        userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
        name: 'Transação 2',
        amount: '1250.00',
        description: 'Descrição teste 2',
        type: 'income',
        transactionDate: '2026-06-10T09:00:00.000Z',
        createdAt: '2026-06-19T15:29:32.969Z',
        updatedAt: '2026-06-19T15:29:32.969Z',
        deletedAt: null
      }
    ]

    const getTransactionsByUserIdUseCase = {
      execute: jest.fn().mockResolvedValue(expectedTransactions)
    }

    const controller = new GetTransactionsByUserIdController(
      getTransactionsByUserIdUseCase
    )

    const req = {
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e'
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
    expect(getTransactionsByUserIdUseCase.execute).toHaveBeenCalledWith(
      req.userId
    )
    expect(getTransactionsByUserIdUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedTransactions)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('User not found')

    const getTransactionsByUserIdUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new GetTransactionsByUserIdController(
      getTransactionsByUserIdUseCase
    )

    const req = {
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e'
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getTransactionsByUserIdUseCase.execute).toHaveBeenCalledWith(
      req.userId
    )
    expect(getTransactionsByUserIdUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
