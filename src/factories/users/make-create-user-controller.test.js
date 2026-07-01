import { CreateUserController } from '../../controllers/user/create-user-controller.js'
import { CreateUserUseCase } from '../../use-cases/user/create-user-use-case.js'
import { makeCreateUserController } from './make-create-user-controller.js'

jest.mock('../../controllers/user/create-user-controller.js')
jest.mock('../../use-cases/user/create-user-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeCreateUserController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    CreateUserUseCase.mockReturnValue(mockUseCase)
    CreateUserController.mockReturnValue(mockController)

    const result = makeCreateUserController()

    expect(CreateUserUseCase).toHaveBeenCalledWith({})
    expect(CreateUserController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
