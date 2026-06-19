import { GetUserByEmailController } from './get-user-by-email-controller.js'

describe('GetUserByEmailController', () => {
  it('should return 200 with user when successful', async () => {
    // Arrange
    const expectedUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarahconnor@resistance.com'
    }

    const getUserByEmailUseCase = {
      execute: jest.fn().mockResolvedValue(expectedUser)
    }

    const controller = new GetUserByEmailController(getUserByEmailUseCase)

    const req = {
      params: {
        email: 'sarahconnor@resistance.com'
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
    expect(getUserByEmailUseCase.execute).toHaveBeenCalledWith(
      'sarahconnor@resistance.com'
    )
    expect(getUserByEmailUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedUser)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('User not found')

    const getUserByEmailUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new GetUserByEmailController(getUserByEmailUseCase)

    const req = {
      params: {
        email: 'notfound@example.com'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getUserByEmailUseCase.execute).toHaveBeenCalledWith(
      'notfound@example.com'
    )
    expect(getUserByEmailUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
