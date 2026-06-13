import { CreateUserController } from './create-user-controller.js'

describe('CreateUserController', () => {
  const mockUserData = {
    first_name: 'Sarah',
    last_name: 'Connor',
    email: 'sarahconnor@skynet.com',
    password: '12345678'
  }

  const expectedUserResponse = {
    id: 1,
    first_name: 'Sarah',
    last_name: 'Connor',
    email: 'sarahconnor@skynet.com'
  }

  class MockCreateUserUseCase {
    async execute({ password, ...userData }) {
      void password
      return { id: 1, ...userData }
    }
  }

  it('should return 201 and the created user when valid data is provided', async () => {
    const createUserUseCase = new MockCreateUserUseCase()
    jest.spyOn(createUserUseCase, 'execute')

    const createUserController = new CreateUserController(createUserUseCase)

    const req = { body: mockUserData }
    const json = jest.fn()
    const res = { status: jest.fn().mockReturnValue({ json }) }
    const next = jest.fn()

    await createUserController.handle(req, res, next)

    expect(createUserUseCase.execute).toHaveBeenCalledWith(mockUserData)
    expect(createUserUseCase.execute).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith(expectedUserResponse)

    expect(next).not.toHaveBeenCalled()
  })

  it('should call next with error when use case throws an exception', async () => {
    const mockError = new Error('Database connection failed')
    const createUserUseCase = {
      execute: jest.fn().mockRejectedValue(mockError)
    }

    const createUserController = new CreateUserController(createUserUseCase)
    const req = { body: mockUserData }
    const res = { status: jest.fn() }
    const next = jest.fn()

    await createUserController.handle(req, res, next)

    expect(createUserUseCase.execute).toHaveBeenCalledWith(mockUserData)
    expect(next).toHaveBeenCalledWith(mockError)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })
})
