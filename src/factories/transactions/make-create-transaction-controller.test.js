import { CreateTransactionController } from '../../controllers/transactions/create-transaction-controller.js'
import { CreateTransactionUseCase } from '../../use-cases/transactions/create-transaction-use-case.js'
import { makeCreateTransactionController } from './make-create-transaction-controller.js'

jest.mock('../../controllers/transactions/create-transaction-controller.js')
jest.mock('../../use-cases/transactions/create-transaction-use-case.js')
jest.mock('../repositories/make-user-repository.js', () => ({
  makeUserRepository: jest.fn(() => ({}))
}))
jest.mock('../repositories/make-transaction-repository.js', () => ({
  makeTransactionRepository: jest.fn(() => ({}))
}))

describe('makeCreateTransactionController', () => {
  it('should create a CreateTransactionController with correct dependencies', () => {
    const mockUseCase = {}
    const mockController = { handle: jest.fn() }

    CreateTransactionUseCase.mockReturnValue(mockUseCase)
    CreateTransactionController.mockReturnValue(mockController)

    const result = makeCreateTransactionController()

    expect(CreateTransactionUseCase).toHaveBeenCalledWith({}, {})
    expect(CreateTransactionController).toHaveBeenCalledWith(mockUseCase)
    expect(result).toBe(mockController)
  })
})
