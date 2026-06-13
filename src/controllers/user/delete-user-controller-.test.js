import { DeleteUserController } from './delete-user-controller.js'

describe('DeleteUserController', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000'

  const mockDeletedUserResponse = {
    id: mockUserId,
    first_name: 'Sarah',
    last_name: 'Connor',
    email: 'sarahconnor@skynet.com',
    isActive: false
  }

  const expectedResponse = {
    message: 'User deleted successfully',
    user: mockDeletedUserResponse
  }

  class MockDeleteUserUseCase {
    async execute(_userId) {
      return mockDeletedUserResponse
    }
  }

  it('should return 200 and success message when user is deleted successfully', async () => {
    const deleteUserUseCase = new MockDeleteUserUseCase()
    jest.spyOn(deleteUserUseCase, 'execute')

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    const req = { params: { id: mockUserId } }
    const json = jest.fn()
    const res = { status: jest.fn().mockReturnValue({ json }) }
    const next = jest.fn()

    await deleteUserController.handle(req, res, next)

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(mockUserId)
    expect(deleteUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith(expectedResponse)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next with error when use case throws an exception', async () => {
    const mockError = new Error('User not found')
    const deleteUserUseCase = {
      execute: jest.fn().mockRejectedValue(mockError)
    }

    const deleteUserController = new DeleteUserController(deleteUserUseCase)
    const req = { params: { id: mockUserId } }
    const res = { status: jest.fn() }
    const next = jest.fn()

    await deleteUserController.handle(req, res, next)

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(mockUserId)

    expect(next).toHaveBeenCalledWith(mockError)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
