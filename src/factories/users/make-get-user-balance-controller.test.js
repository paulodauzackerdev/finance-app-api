import { GetUserBalanceController } from '../../controllers/user/get-user-balance-controller.js'
import { GetUserBalanceUseCase } from '../../use-cases/user/get-user-balance-use-case.js'
import { makeGetUserBalanceController } from './make-get-user-balance-controller.js'

jest.mock('../../controllers/user/get-user-balance-controller.js')
jest.mock('../../use-cases/user/get-user-balance-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeGetUserBalanceController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    GetUserBalanceUseCase.mockReturnValue(mockUseCase)
    GetUserBalanceController.mockReturnValue(mockController)

    const result = makeGetUserBalanceController()

    expect(GetUserBalanceUseCase).toHaveBeenCalledWith({}, {})
    expect(GetUserBalanceController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
