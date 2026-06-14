import { DeleteUserController } from './delete-user-controller.js'

describe('DeleteUserController', () => {
  it('should return 200 when user is deleted successfully', async () => {
    // Arrange
    const expectedDeletedUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      first_name: 'Sarah',
      last_name: 'Connor',
      email: 'sarahconnor@resistance.com'
    }

    const expectedResponse = {
      message: 'User deleted successfully',
      user: expectedDeletedUser
    }

    const deleteUserUseCase = {
      execute: jest.fn().mockResolvedValue(expectedDeletedUser)
    }

    const controller = new DeleteUserController(deleteUserUseCase)

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
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000'
    )
    expect(deleteUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedResponse)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('User not found')

    const deleteUserUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new DeleteUserController(deleteUserUseCase)

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
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000'
    )
    expect(deleteUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
