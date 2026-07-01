import { GetDeletedTransactionsByUserIdController } from '../../controllers/transactions/get-deleted-transactions-by-user-id-controller.js'
import { GetDeletedTransactionsByUserIdUseCase } from '../../use-cases/transactions/get-deleted-transactions-by-user-id-use-case.js'
import { makeGetDeletedTransactionsByUserIdController } from './make-get-deleted-transactions-by-user-id-controller.js'

jest.mock(
  '../../controllers/transactions/get-deleted-transactions-by-user-id-controller.js'
)
jest.mock(
  '../../use-cases/transactions/get-deleted-transactions-by-user-id-use-case.js'
)
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeGetDeletedTransactionsByUserIdController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    GetDeletedTransactionsByUserIdUseCase.mockReturnValue(mockUseCase)
    GetDeletedTransactionsByUserIdController.mockReturnValue(mockController)

    const result = makeGetDeletedTransactionsByUserIdController()

    expect(GetDeletedTransactionsByUserIdUseCase).toHaveBeenCalledWith({}, {})
    expect(GetDeletedTransactionsByUserIdController).toHaveBeenCalledWith(
      mockUseCase
    )
    expect(result).toBe(mockController)
  })
})
