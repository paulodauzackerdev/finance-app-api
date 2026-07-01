import { GetDeletedTransactionsController } from '../../controllers/transactions/get-deleted-transactions-controller.js'
import { GetDeletedTransactionsUseCase } from '../../use-cases/transactions/get-deleted-transactions-use-case.js'
import { makeGetDeletedTransactionsController } from './make-get-deleted-transactions-controller.js'

jest.mock(
  '../../controllers/transactions/get-deleted-transactions-controller.js'
)
jest.mock('../../use-cases/transactions/get-deleted-transactions-use-case.js')
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeGetDeletedTransactionsController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    GetDeletedTransactionsUseCase.mockReturnValue(mockUseCase)
    GetDeletedTransactionsController.mockReturnValue(mockController)

    const result = makeGetDeletedTransactionsController()

    expect(GetDeletedTransactionsUseCase).toHaveBeenCalledWith({})
    expect(GetDeletedTransactionsController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
