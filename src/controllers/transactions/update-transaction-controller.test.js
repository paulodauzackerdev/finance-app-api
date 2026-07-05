import { UpdateTransactionController } from './update-transaction-controller.js'

describe('UpdateTransactionController', () => {
  it('should return 200 when transaction is updated successfully', async () => {
    // Arrange
    const expectedUpdatedTransaction = {
      id: '35504dde-6b4e-4d0e-a84e-854800175083',
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
      name: 'Transação Atualizada',
      amount: '4500.00',
      description: 'Descrição atualizada',
      type: 'expense',
      transactionDate: '2026-06-03T15:30:00.000Z',
      createdAt: '2026-06-19T12:17:20.763Z',
      updatedAt: '2026-06-20T10:00:00.000Z',
      deletedAt: null
    }

    const updateTransactionUseCase = {
      execute: jest.fn().mockResolvedValue(expectedUpdatedTransaction)
    }

    const controller = new UpdateTransactionController(updateTransactionUseCase)

    const req = {
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
      params: {
        id: '35504dde-6b4e-4d0e-a84e-854800175083'
      },
      body: {
        name: 'Transação Atualizada',
        amount: 4500.0,
        description: 'Descrição atualizada'
      }
    }

    const expectedResponse = {
      message: 'Transaction updated successfully',
      transaction: expectedUpdatedTransaction
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
    expect(updateTransactionUseCase.execute).toHaveBeenCalledWith(
      '35504dde-6b4e-4d0e-a84e-854800175083',
      req.userId,
      req.body
    )
    expect(updateTransactionUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedResponse)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('Transaction not found')

    const updateTransactionUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new UpdateTransactionController(updateTransactionUseCase)

    const req = {
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
      params: {
        id: '35504dde-6b4e-4d0e-a84e-854800175083'
      },
      body: {
        name: 'Transação Atualizada'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(updateTransactionUseCase.execute).toHaveBeenCalledWith(
      '35504dde-6b4e-4d0e-a84e-854800175083',
      req.userId,
      req.body
    )
    expect(updateTransactionUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
