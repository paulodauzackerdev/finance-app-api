import { HardDeleteTransactionController } from '../../controllers/transactions/hard-delete-transaction-controller.js'
import { HardDeleteTransactionUseCase } from '../../use-cases/transactions/hard-delete-transaction-use-case.js'
import { makeHardDeleteTransactionController } from './make-hard-delete-transaction-controller.js'

jest.mock(
  '../../controllers/transactions/hard-delete-transaction-controller.js'
)
jest.mock('../../use-cases/transactions/hard-delete-transaction-use-case.js')
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeHardDeleteTransactionController', () => {
  it('should create controller with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    HardDeleteTransactionUseCase.mockReturnValue(mockUseCase)
    HardDeleteTransactionController.mockReturnValue(mockController)

    const result = makeHardDeleteTransactionController()

    expect(HardDeleteTransactionUseCase).toHaveBeenCalledWith({})
    expect(HardDeleteTransactionController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
