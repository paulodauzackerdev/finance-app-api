import { SoftDeleteTransactionController } from './soft-delete-transaction-controller.js'

describe('SoftDeleteTransactionController', () => {
  it('should return 200 when transaction is deleted successfully', async () => {
    // Arrange
    const expectedDeletedTransaction = {
      id: '35504dde-6b4e-4d0e-a84e-854800175083',
      userId: 'dbcbb239-0825-47cf-847e-6d97615b054e',
      name: 'Transação Teste',
      amount: '3500.58',
      description: 'Descrição teste',
      type: 'expense',
      transactionDate: '2026-06-03T15:30:00.000Z',
      createdAt: '2026-06-19T12:17:20.763Z',
      updatedAt: '2026-06-19T12:17:20.763Z',
      deletedAt: null
    }

    const expectedResponse = {
      message: 'Transaction deleted successfully',
      transaction: expectedDeletedTransaction
    }

    const softDeleteTransactionUseCase = {
      execute: jest.fn().mockResolvedValue(expectedDeletedTransaction)
    }

    const controller = new SoftDeleteTransactionController(
      softDeleteTransactionUseCase
    )

    const req = {
      params: {
        id: '35504dde-6b4e-4d0e-a84e-854800175083'
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
    expect(softDeleteTransactionUseCase.execute).toHaveBeenCalledWith(
      '35504dde-6b4e-4d0e-a84e-854800175083'
    )
    expect(softDeleteTransactionUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedResponse)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('Transaction not found')

    const softDeleteTransactionUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new SoftDeleteTransactionController(
      softDeleteTransactionUseCase
    )

    const req = {
      params: {
        id: '35504dde-6b4e-4d0e-a84e-854800175083'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(softDeleteTransactionUseCase.execute).toHaveBeenCalledWith(
      '35504dde-6b4e-4d0e-a84e-854800175083'
    )
    expect(softDeleteTransactionUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
