import { GetUserByEmailController } from '../../controllers/user/get-user-by-email-controller.js'
import { GetUserByEmailUseCase } from '../../use-cases/user/get-user-by-email-use-case.js'
import { makeGetUserByEmailController } from './make-get-user-by-email-controller.js'

jest.mock('../../controllers/user/get-user-by-email-controller.js')
jest.mock('../../use-cases/user/get-user-by-email-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))

describe('makeGetUserByEmailController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    GetUserByEmailUseCase.mockReturnValue(mockUseCase)
    GetUserByEmailController.mockReturnValue(mockController)

    const result = makeGetUserByEmailController()

    expect(GetUserByEmailUseCase).toHaveBeenCalledWith({})
    expect(GetUserByEmailController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
