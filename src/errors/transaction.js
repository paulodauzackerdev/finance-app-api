export class InvalidTransactionNameError extends Error {
  constructor(message = 'Invalid transaction name') {
    super(message)
    this.name = 'InvalidTransactionNameError'
  }
}

export class InvalidTransactionAmountError extends Error {
  constructor(message = 'Invalid transaction amout') {
    super(message)
    this.name = 'InvalidTransactionAmountError'
  }
}

export class InvalidTransactionTypeError extends Error {
  constructor(message = 'Invalid transaction type') {
    super(message)
    this.name = 'InvalidTransactionTypeError'
  }
}

export class InvalidTransactionDateError extends Error {
  constructor(message = 'Invalid transaction date') {
    super(message)
    this.name = 'InvalidTransactionDateError'
  }
}

export class InvalidTransactionDescriptionError extends Error {
  constructor(message = 'Invalid transaction description') {
    super(message)
    this.name = 'InvalidTransactionDescriptionError'
  }
}

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
