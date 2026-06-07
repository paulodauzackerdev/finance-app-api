import { InvalidTransactionTypeError } from '../../errors/transaction.js'

const ALLOWED_TYPES = ['income', 'expense', 'investment']

export const validateTransactionType = (type) => {
  if (typeof type !== 'string') {
    throw new InvalidTransactionTypeError('Transaction type must be a string')
  }

  const normalizedType = type.trim().toLowerCase()

  if (!ALLOWED_TYPES.includes(normalizedType)) {
    throw new InvalidTransactionTypeError(
      `Transaction type must be one of: ${ALLOWED_TYPES.join(', ')}`
    )
  }

  return normalizedType
}
