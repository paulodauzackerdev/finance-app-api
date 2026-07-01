import { GetDeletedUsersController } from '../../controllers/user/get-deleted-users-controller.js'
import { GetDeletedUsersUseCase } from '../../use-cases/user/get-deleted-users-use-case.js'
import { makeGetDeletedUsersController } from './make-get-deleted-users-controller.js'

jest.mock('../../controllers/user/get-deleted-users-controller.js')
jest.mock('../../use-cases/user/get-deleted-users-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeGetDeletedUsersController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    GetDeletedUsersUseCase.mockReturnValue(mockUseCase)
    GetDeletedUsersController.mockReturnValue(mockController)

    const result = makeGetDeletedUsersController()

    expect(GetDeletedUsersUseCase).toHaveBeenCalledWith({})
    expect(GetDeletedUsersController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
