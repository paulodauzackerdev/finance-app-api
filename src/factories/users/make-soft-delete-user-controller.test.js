import { SoftDeleteUserController } from '../../controllers/user/soft-delete-user-controller.js'
import { SoftDeleteUserUseCase } from '../../use-cases/user/soft-delete-user-use-case.js'
import { makeSoftDeleteUserController } from './make-soft-delete-user-controller.js'

jest.mock('../../controllers/user/soft-delete-user-controller.js')
jest.mock('../../use-cases/user/soft-delete-user-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeSoftDeleteUserController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    SoftDeleteUserUseCase.mockReturnValue(mockUseCase)
    SoftDeleteUserController.mockReturnValue(mockController)

    const result = makeSoftDeleteUserController()

    expect(SoftDeleteUserUseCase).toHaveBeenCalledWith({})
    expect(SoftDeleteUserController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
