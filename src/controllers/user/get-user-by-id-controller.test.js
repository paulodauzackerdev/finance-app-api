import { GetUserByIdController } from './get-user-by-id-controller.js'

describe('GetUserByIdController', () => {
  it('should return 200 with user when successful', async () => {
    // Arrange
    const expectedUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarahconnor@resistance.com'
    }

    const getUserByIdUseCase = {
      execute: jest.fn().mockResolvedValue(expectedUser)
    }

    const controller = new GetUserByIdController(getUserByIdUseCase)

    const req = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      userRole: 'user',
      params: {
        id: '550e8400-e29b-41d4-a716-446655440000'
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
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000',
      req.userId,
      req.userRole
    )
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
      userId: '550e8400-e29b-41d4-a716-446655440000',
      userRole: 'user',
      params: {
        id: '550e8400-e29b-41d4-a716-446655440001'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440001',
      req.userId,
      req.userRole
    )
    expect(getUserByIdUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
