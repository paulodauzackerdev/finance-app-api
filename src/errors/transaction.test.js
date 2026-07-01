import {
  TransactionNotFoundError,
  TransactionUnauthorizedError
} from './transaction.js'

describe('TransactionNotFoundError', () => {
  it('should create error with default message', () => {
    const error = new TransactionNotFoundError()

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('TransactionNotFoundError')
    expect(error.message).toBe('Transaction not found')
  })

  it('should create error with custom message', () => {
    const error = new TransactionNotFoundError('Custom not found message')

    expect(error.message).toBe('Custom not found message')
  })
})

describe('TransactionUnauthorizedError', () => {
  it('should create error with default message', () => {
    const error = new TransactionUnauthorizedError()

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('TransactionUnauthorizedError')
    expect(error.message).toBe(
      'You are not authorized to access this transaction'
    )
  })

  it('should create error with custom message', () => {
    const error = new TransactionUnauthorizedError(
      'Custom unauthorized message'
    )

    expect(error.message).toBe('Custom unauthorized message')
  })
})
