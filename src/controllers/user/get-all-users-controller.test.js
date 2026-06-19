import { GetAllUsersController } from './get-all-users-controller.js'

describe('GetAllUsersController', () => {
  it('should return 200 with all users when successful', async () => {
    // Arrange
    const expectedUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'sarahconnor@resistance.com'
      },
      {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        firstName: 'John',
        lastName: 'Connor',
        email: 'johnconnor@resistance.com'
      }
    ]

    const getAllUsersUseCase = {
      execute: jest.fn().mockResolvedValue(expectedUsers)
    }

    const controller = new GetAllUsersController(getAllUsersUseCase)

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
    expect(getAllUsersUseCase.execute).toHaveBeenCalledWith()
    expect(getAllUsersUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedUsers)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('Database connection failed')

    const getAllUsersUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new GetAllUsersController(getAllUsersUseCase)

    const req = {}

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getAllUsersUseCase.execute).toHaveBeenCalledWith()
    expect(getAllUsersUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
