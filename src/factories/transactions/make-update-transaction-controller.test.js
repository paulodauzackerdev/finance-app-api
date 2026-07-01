import { UpdateTransactionController } from '../../controllers/transactions/update-transaction-controller.js'
import { UpdateTransactionUseCase } from '../../use-cases/transactions/update-transaction-use-case.js'
import { makeUpdateTransactionController } from './make-update-transaction-controller.js'

jest.mock('../../controllers/transactions/update-transaction-controller.js')
jest.mock('../../use-cases/transactions/update-transaction-use-case.js')
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeUpdateTransactionController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    UpdateTransactionUseCase.mockReturnValue(mockUseCase)
    UpdateTransactionController.mockReturnValue(mockController)

    const result = makeUpdateTransactionController()

    expect(UpdateTransactionUseCase).toHaveBeenCalledWith({})
    expect(UpdateTransactionController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
