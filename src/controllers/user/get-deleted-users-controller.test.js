import { GetDeletedUsersController } from './get-deleted-users-controller.js'

describe('GetDeletedUsersController', () => {
  it('should return 200 with deleted users when successful', async () => {
    // Arrange
    const expectedDeletedUsers = [
      {
        id: 'dea610ff-53b1-43ee-abac-2822488ad629',
        firstName: 'Arnold',
        lastName: 'Terminator',
        email: 't800@resistance.com',
        deletedAt: '2026-06-19T20:56:10.444Z'
      },
      {
        id: '1672ff0d-baf9-4189-91ee-11bec0859151',
        firstName: 'John',
        lastName: 'Connor',
        email: 'john@resistance.com',
        deletedAt: '2026-06-19T17:08:06.581Z'
      }
    ]

    const getDeletedUsersUseCase = {
      execute: jest.fn().mockResolvedValue(expectedDeletedUsers)
    }

    const controller = new GetDeletedUsersController(getDeletedUsersUseCase)

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
    expect(getDeletedUsersUseCase.execute).toHaveBeenCalledWith()
    expect(getDeletedUsersUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedDeletedUsers)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('Database connection failed')

    const getDeletedUsersUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new GetDeletedUsersController(getDeletedUsersUseCase)

    const req = {}

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(getDeletedUsersUseCase.execute).toHaveBeenCalledWith()
    expect(getDeletedUsersUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
