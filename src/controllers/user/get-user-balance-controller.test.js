import { GetUserBalanceController } from './get-user-balance-controller.js'

describe('GetUserBalanceController', () => {
  it('should return 200 with user balance when successful', async () => {
    // Arrange
    const expectedBalance = {
      balance: 1500.5,
      currency: 'BRL'
    }

    const getUserBalanceUseCase = {
      execute: jest.fn().mockResolvedValue(expectedBalance)
    }

    const controller = new GetUserBalanceController(getUserBalanceUseCase)

    const req = {
      params: {
        userId: '1'
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
    expect(getUserBalanceUseCase.execute).toHaveBeenCalledWith('1')
    expect(getUserBalanceUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedBalance)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('User not found')

    const getUserBalanceUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new GetUserBalanceController(getUserBalanceUseCase)

    const req = {
      params: {
        userId: '999'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getUserBalanceUseCase.execute).toHaveBeenCalledWith('999')
    expect(getUserBalanceUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
