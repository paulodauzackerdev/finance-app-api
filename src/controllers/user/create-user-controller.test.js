import { CreateUserController } from './create-user-controller.js'

describe('CreateUserController', () => {
  it('should return 201 when user is created successfully', async () => {
    // Arrange
    const expectedUserResponse = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      first_name: 'Sarah',
      last_name: 'Connor',
      email: 'sarahconnor@resistance.com'
    }

    const createUserUseCase = {
      execute: jest.fn().mockResolvedValue(expectedUserResponse)
    }

    const controller = new CreateUserController(createUserUseCase)

    const req = {
      body: {
        first_name: 'Sarah',
        last_name: 'Connor',
        email: 'sarahconnor@resistance.com',
        password: '12345678'
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
    expect(createUserUseCase.execute).toHaveBeenCalledWith(req.body)
    expect(createUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(json).toHaveBeenCalledWith(expectedUserResponse)
    expect(json).toHaveBeenCalledTimes(1)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next when use case throws an error', async () => {
    // Arrange
    const error = new Error('Database connection failed')

    const createUserUseCase = {
      execute: jest.fn().mockRejectedValue(error)
    }

    const controller = new CreateUserController(createUserUseCase)

    const req = {
      body: {
        first_name: 'Sarah',
        last_name: 'Connor',
        email: 'sarahconnor@resistance.com',
        password: '12345678'
      }
    }

    const res = {
      status: jest.fn()
    }

    const next = jest.fn()

    // Act
    await controller.handle(req, res, next)

    // Assert
    expect(createUserUseCase.execute).toHaveBeenCalledWith(req.body)
    expect(createUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)

    expect(res.status).not.toHaveBeenCalled()
  })
})
