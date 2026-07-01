import { RestoreTransactionController } from '../../controllers/transactions/restore-transaction-controller.js'
import { RestoreTransactionUseCase } from '../../use-cases/transactions/restore-transaction-use-case.js'
import { makeRestoreTransactionController } from './make-restore-transaction-controller.js'

jest.mock('../../controllers/transactions/restore-transaction-controller.js')
jest.mock('../../use-cases/transactions/restore-transaction-use-case.js')
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeRestoreTransactionController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    RestoreTransactionUseCase.mockReturnValue(mockUseCase)
    RestoreTransactionController.mockReturnValue(mockController)

    const result = makeRestoreTransactionController()

    expect(RestoreTransactionUseCase).toHaveBeenCalledWith({})
    expect(RestoreTransactionController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
