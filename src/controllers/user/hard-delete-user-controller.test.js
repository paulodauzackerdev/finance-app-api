import { HardDeleteUserController } from './hard-delete-user-controller.js'

describe('HardDeleteUserController', () => {
  it('should return 200 when user is permanently deleted successfully', async () => {
    // Arrange
    const expectedHardDeletedUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarahconnor@resistance.com'
    }

    const expectedResponse = {
      message: 'User permanently deleted successfully',
      user: expectedHardDeletedUser
    }

    const hardDeleteUserUseCase = {
      execute: jest.fn().mockResolvedValue(expectedHardDeletedUser)
    }

    const controller = new HardDeleteUserController(hardDeleteUserUseCase)

    const req = {
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
    expect(hardDeleteUserUseCase.execute).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000'
    )
    expect(hardDeleteUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedResponse)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('User not found')

    const hardDeleteUserUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new HardDeleteUserController(hardDeleteUserUseCase)

    const req = {
      params: {
        id: '550e8400-e29b-41d4-a716-446655440000'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(hardDeleteUserUseCase.execute).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000'
    )
    expect(hardDeleteUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
