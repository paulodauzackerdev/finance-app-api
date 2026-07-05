import { CreateTransactionController } from './create-transaction-controller.js'

describe('CreateTransactionController', () => {
  it('should return 201 when transaction is created successfully', async () => {
    // Arrange
    const expectedTransactionResponse = {
      id: 'c00da004-894a-4f25-b810-cd2226b29857',
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
      name: 'Cafeteria',
      amount: '12.5',
      description: 'Café da manhã',
      type: 'expense',
      transactionDate: '2026-06-19T10:00:00.000Z',
      createdAt: '2026-06-19T15:29:32.969Z',
      updatedAt: '2026-06-19T15:29:32.969Z',
      deletedAt: null
    }

    const expectedResponse = {
      message: 'Transaction created successfully',
      transaction: expectedTransactionResponse
    }

    const createTransactionUseCase = {
      execute: jest.fn().mockResolvedValue(expectedTransactionResponse)
    }

    const controller = new CreateTransactionController(createTransactionUseCase)

    const req = {
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
      body: {
        name: 'Cafeteria',
        amount: 12.5,
        description: 'Café da manhã',
        type: 'expense',
        transactionDate: '2026-06-19T10:00:00.000Z'
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
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith({
      ...req.body,
      userId: req.userId
    })
    expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedResponse)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('Database connection failed')

    const createTransactionUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new CreateTransactionController(createTransactionUseCase)

    const req = {
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
      body: {}
    }
    const res = { status: jest.fn() }
    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(next).toHaveBeenCalledWith(error)
    expect(res.status).not.toHaveBeenCalled()
  })
})
