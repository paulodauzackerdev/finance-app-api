import { UpdateUserController } from './update-user-controller.js'

describe('UpdateUserController', () => {
  it('should return 200 when user is updated successfully', async () => {
    // Arrange
    const expectedUpdatedUser = {
      id: 1,
      first_name: 'Sarah',
      last_name: 'Connor Updated',
      email: 'sarahconnor@resistance.com'
    }

    const updateUserUseCase = {
      execute: jest.fn().mockResolvedValue(expectedUpdatedUser)
    }

    const controller = new UpdateUserController(updateUserUseCase)

    const req = {
      params: {
        id: '1'
      },
      body: {
        last_name: 'Connor Updated'
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
    expect(updateUserUseCase.execute).toHaveBeenCalledWith('1', req.body)
    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedUpdatedUser)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('User not found')

    const updateUserUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new UpdateUserController(updateUserUseCase)

    const req = {
      params: {
        id: '999'
      },
      body: {
        first_name: 'John'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(updateUserUseCase.execute).toHaveBeenCalledWith('999', req.body)
    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
