import { SoftDeleteTransactionController } from '../../controllers/transactions/soft-delete-transaction-controller.js'
import { SoftDeleteTransactionUseCase } from '../../use-cases/transactions/soft-delete-transaction-use-case.js'
import { makeSoftDeleteTransactionController } from './make-soft-delete-transaction-controller.js'

jest.mock(
  '../../controllers/transactions/soft-delete-transaction-controller.js'
)
jest.mock('../../use-cases/transactions/soft-delete-transaction-use-case.js')
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeSoftDeleteTransactionController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    SoftDeleteTransactionUseCase.mockReturnValue(mockUseCase)
    SoftDeleteTransactionController.mockReturnValue(mockController)

    const result = makeSoftDeleteTransactionController()

    expect(SoftDeleteTransactionUseCase).toHaveBeenCalledWith({})
    expect(SoftDeleteTransactionController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
