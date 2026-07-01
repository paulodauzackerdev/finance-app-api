import { GetUserByIdController } from '../../controllers/user/get-user-by-id-controller.js'
import { GetUserByIdUseCase } from '../../use-cases/user/get-user-by-id-use-case.js'
import { makeGetUserByIdController } from './make-get-user-by-id-controller.js'

jest.mock('../../controllers/user/get-user-by-id-controller.js')
jest.mock('../../use-cases/user/get-user-by-id-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeGetUserByIdController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    GetUserByIdUseCase.mockReturnValue(mockUseCase)
    GetUserByIdController.mockReturnValue(mockController)

    const result = makeGetUserByIdController()

    expect(GetUserByIdUseCase).toHaveBeenCalledWith({})
    expect(GetUserByIdController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
