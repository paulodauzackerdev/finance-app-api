import { InvalidTransactionAmountError } from '../../errors/transaction.js'

export const validateTransactionAmount = (amount) => {
  const parsedAmount = Number(amount)

  if (Number.isNaN(parsedAmount)) {
    throw new InvalidTransactionAmountError('Amount must be a valid number')
  }

  if (!Number.isFinite(parsedAmount)) {
    throw new InvalidTransactionAmountError('Amount must be a finite number')
  }

  if (parsedAmount <= 0) {
    throw new InvalidTransactionAmountError('Amount must be greater than zero')
  }

  const amountInCents = Math.round(parsedAmount * 100)

  if (!Number.isInteger(amountInCents)) {
    throw new InvalidTransactionAmountError(
      'Amount must have at most 2 decimal places'
    )
  }

  return Number(parsedAmount.toFixed(2))
}
