import { TransactionRepository } from '../../repositories/postgres/postgres-transaction-repository.js'
import { makeTransactionRepository } from './make-transaction-repository.js'

jest.mock(
  '../../repositories/postgres/postgres-transaction-repository.js',
  () => ({
    TransactionRepository: jest.fn()
  })
)

describe('makeTransactionRepository', () => {
  it('should create a new TransactionRepository instance', () => {
    const mockInstance = {}
    TransactionRepository.mockReturnValue(mockInstance)

    const result = makeTransactionRepository()

    expect(TransactionRepository).toHaveBeenCalledTimes(1)
    expect(TransactionRepository).toHaveBeenCalledWith()
    expect(result).toBe(mockInstance)
  })
})
