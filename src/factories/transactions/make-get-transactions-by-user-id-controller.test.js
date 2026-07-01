import { GetTransactionsByUserIdController } from '../../controllers/transactions/get-transactions-by-user-id-controller.js'
import { GetTransactionsByUserIdUseCase } from '../../use-cases/transactions/get-transactions-by-user-id-use-case.js'
import { makeGetTransactionsByUserIdController } from './make-get-transactions-by-user-id-controller.js'

jest.mock(
  '../../controllers/transactions/get-transactions-by-user-id-controller.js'
)
jest.mock(
  '../../use-cases/transactions/get-transactions-by-user-id-use-case.js'
)
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeGetTransactionsByUserIdController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    GetTransactionsByUserIdUseCase.mockReturnValue(mockUseCase)
    GetTransactionsByUserIdController.mockReturnValue(mockController)

    const result = makeGetTransactionsByUserIdController()

    expect(GetTransactionsByUserIdUseCase).toHaveBeenCalledWith({}, {})
    expect(GetTransactionsByUserIdController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
