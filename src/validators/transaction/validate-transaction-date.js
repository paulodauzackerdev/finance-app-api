// validate-transaction-date.js
import { InvalidTransactionDateError } from '../../errors/transaction.js'

export const validateTransactionDate = (date) => {
  if (date === undefined || date === null) {
    return new Date()
  }

  if (typeof date !== 'string' && !(date instanceof Date)) {
    throw new InvalidTransactionDateError(
      'Transaction date must be a string or Date object'
    )
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    throw new InvalidTransactionDateError('Invalid transaction date format')
  }

  return parsedDate
}
