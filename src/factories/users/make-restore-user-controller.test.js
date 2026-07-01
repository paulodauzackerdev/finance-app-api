import { RestoreUserController } from '../../controllers/user/restore-user-controller.js'
import { RestoreUserUseCase } from '../../use-cases/user/restore-user-use-case.js'
import { makeRestoreUserController } from './make-restore-user-controller.js'

jest.mock('../../controllers/user/restore-user-controller.js')
jest.mock('../../use-cases/user/restore-user-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeRestoreUserController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    RestoreUserUseCase.mockReturnValue(mockUseCase)
    RestoreUserController.mockReturnValue(mockController)

    const result = makeRestoreUserController()

    expect(RestoreUserUseCase).toHaveBeenCalledWith({})
    expect(RestoreUserController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
