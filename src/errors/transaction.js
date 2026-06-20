export class TransactionNotFoundError extends Error {
  constructor(message = 'Transaction not found') {
    super(message)
    this.name = 'TransactionNotFoundError'
  }
}

export class TransactionUnauthorizedError extends Error {
  constructor(message = 'You are not authorized to access this transaction') {
    super(message)
    this.name = 'TransactionUnauthorizedError'
  }
}
