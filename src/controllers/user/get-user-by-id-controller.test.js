import { GetUserByIdController } from './get-user-by-id-controller.js'

describe('GetUserByIdController', () => {
  it('should return 200 with user when successful', async () => {
    // Arrange
    const expectedUser = {
      id: 1,
      first_name: 'Sarah',
      last_name: 'Connor',
      email: 'sarahconnor@resistance.com'
    }

    const getUserByIdUseCase = {
      execute: jest.fn().mockResolvedValue(expectedUser)
    }

    const controller = new GetUserByIdController(getUserByIdUseCase)

    const req = {
      params: {
        id: '1'
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
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith('1')
    expect(getUserByIdUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedUser)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('User not found')

    const getUserByIdUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new GetUserByIdController(getUserByIdUseCase)

    const req = {
      params: {
        id: '999'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith('999')
    expect(getUserByIdUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
