import validator from 'validator'
import { InvalidTransactionNameError } from '../../errors/transaction.js'

export const validateTransactionName = (name, min = 1, max = 100) => {
  if (typeof name !== 'string') {
    throw new InvalidTransactionNameError('Transaction name must be a string')
  }

  const trimmedName = name.trim()

  if (!trimmedName) {
    throw new InvalidTransactionNameError('Transaction name is required')
  }

  if (!validator.isLength(trimmedName, { min, max })) {
    throw new InvalidTransactionNameError(
      `Transaction name must have between ${min} and ${max} characters`
    )
  }

  return trimmedName
}
