import { GetAllUsersController } from '../../controllers/user/get-all-users-controller.js'
import { GetAllUsersUseCase } from '../../use-cases/user/get-all-users-use-case.js'
import { makeGetAllUsersController } from './make-get-all-users-controller.js'

jest.mock('../../controllers/user/get-all-users-controller.js')
jest.mock('../../use-cases/user/get-all-users-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeGetAllUsersController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    GetAllUsersUseCase.mockReturnValue(mockUseCase)
    GetAllUsersController.mockReturnValue(mockController)

    const result = makeGetAllUsersController()

    expect(GetAllUsersUseCase).toHaveBeenCalledWith({})
    expect(GetAllUsersController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
