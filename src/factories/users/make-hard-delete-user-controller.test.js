import { HardDeleteUserController } from '../../controllers/user/hard-delete-user-controller.js'
import { HardDeleteUserUseCase } from '../../use-cases/user/hard-delete-user-use-case.js'
import { makeHardDeleteUserController } from './make-hard-delete-user-controller.js'

jest.mock('../../controllers/user/hard-delete-user-controller.js')
jest.mock('../../use-cases/user/hard-delete-user-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeHardDeleteUserController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    HardDeleteUserUseCase.mockReturnValue(mockUseCase)
    HardDeleteUserController.mockReturnValue(mockController)

    const result = makeHardDeleteUserController()

    expect(HardDeleteUserUseCase).toHaveBeenCalledWith({})
    expect(HardDeleteUserController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
