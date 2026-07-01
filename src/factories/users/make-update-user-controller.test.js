import { UpdateUserController } from '../../controllers/user/update-user-controller.js'
import { UpdateUserUseCase } from '../../use-cases/user/update-user-use-case.js'
import { makeUpdateUserController } from './make-update-user-controller.js'

jest.mock('../../controllers/user/update-user-controller.js')
jest.mock('../../use-cases/user/update-user-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeUpdateUserController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    UpdateUserUseCase.mockReturnValue(mockUseCase)
    UpdateUserController.mockReturnValue(mockController)

    const result = makeUpdateUserController()

    expect(UpdateUserUseCase).toHaveBeenCalledWith({})
    expect(UpdateUserController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
