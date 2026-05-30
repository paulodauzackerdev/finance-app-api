import validator from 'validator'

import {
  InvalidTransactionIdError,
  InvalidTransactionNameError,
  InvalidTransactionAmountError,
  InvalidTransactionTypeError,
  InvalidTransactionDateError,
  InvalidTransactionDescriptionError,
  TransactionNotFoundError
} from '../../errors/transaction.js'

const ALLOWED_TRANSACTION_TYPES = ['income', 'expense', 'investment']

const ALLOWED_UPDATE_FIELDS = [
  'name',
  'amount',
  'description',
  'type',
  'transaction_date'
]

export class UpdateTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(transactionId, updateParams) {
    if (!validator.isUUID(transactionId)) {
      throw new InvalidTransactionIdError()
    }

    const existingTransaction =
      await this.transactionRepository.findById(transactionId)

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    const filteredUpdateParams = {}

    for (const key of Object.keys(updateParams)) {
      if (ALLOWED_UPDATE_FIELDS.includes(key)) {
        filteredUpdateParams[key] = updateParams[key]
      }
    }

    if (Object.keys(filteredUpdateParams).length === 0) {
      return existingTransaction
    }

    const allowedUpdates = {}

    if (filteredUpdateParams.name !== undefined) {
      if (typeof filteredUpdateParams.name !== 'string') {
        throw new InvalidTransactionNameError(
          'Transaction name must be a string'
        )
      }

      const trimmedName = filteredUpdateParams.name.trim()

      if (!trimmedName) {
        throw new InvalidTransactionNameError('Transaction name is required')
      }

      if (
        !validator.isLength(trimmedName, {
          min: 1,
          max: 100
        })
      ) {
        throw new InvalidTransactionNameError(
          'Transaction name must have between 1 and 100 characters'
        )
      }

      if (trimmedName !== existingTransaction.name) {
        allowedUpdates.name = trimmedName
      }
    }

    if (filteredUpdateParams.amount !== undefined) {
      const parsedAmount = Number(filteredUpdateParams.amount)

      if (Number.isNaN(parsedAmount)) {
        throw new InvalidTransactionAmountError('Amount must be a valid number')
      }

      if (!Number.isFinite(parsedAmount)) {
        throw new InvalidTransactionAmountError(
          'Amount must be a finite number'
        )
      }

      if (parsedAmount <= 0) {
        throw new InvalidTransactionAmountError(
          'Amount must be greater than zero'
        )
      }

      const amountInCents = Math.round(parsedAmount * 100)

      if (!Number.isInteger(amountInCents)) {
        throw new InvalidTransactionAmountError(
          'Amount must have at most 2 decimal places'
        )
      }

      const finalAmount = Number(parsedAmount.toFixed(2))

      if (finalAmount !== Number(existingTransaction.amount)) {
        allowedUpdates.amount = finalAmount
      }
    }

    if (filteredUpdateParams.description !== undefined) {
      let normalizedDescription = null

      if (filteredUpdateParams.description !== null) {
        if (typeof filteredUpdateParams.description !== 'string') {
          throw new InvalidTransactionDescriptionError(
            'Description must be a string'
          )
        }

        normalizedDescription = filteredUpdateParams.description.trim() || null
      }

      if (normalizedDescription !== existingTransaction.description) {
        allowedUpdates.description = normalizedDescription
      }
    }

    if (filteredUpdateParams.type !== undefined) {
      if (typeof filteredUpdateParams.type !== 'string') {
        throw new InvalidTransactionTypeError(
          'Transaction type must be a string'
        )
      }

      const normalizedType = filteredUpdateParams.type.trim().toLowerCase()

      if (!ALLOWED_TRANSACTION_TYPES.includes(normalizedType)) {
        throw new InvalidTransactionTypeError(
          `Transaction type must be one of: ${ALLOWED_TRANSACTION_TYPES.join(', ')}`
        )
      }

      if (normalizedType !== existingTransaction.type) {
        allowedUpdates.type = normalizedType
      }
    }

    if (filteredUpdateParams.transaction_date !== undefined) {
      let normalizedDate = null

      if (filteredUpdateParams.transaction_date !== null) {
        const parsedDate = new Date(filteredUpdateParams.transaction_date)

        if (Number.isNaN(parsedDate.getTime())) {
          throw new InvalidTransactionDateError('Invalid transaction date')
        }

        normalizedDate = parsedDate
      }

      const existingDate = existingTransaction.transaction_date
        ? new Date(existingTransaction.transaction_date)
        : null

      if (
        !existingDate ||
        normalizedDate?.getTime() !== existingDate.getTime()
      ) {
        allowedUpdates.transaction_date = normalizedDate
      }
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return existingTransaction
    }

    const updatedTransaction = await this.transactionRepository.update(
      transactionId,
      allowedUpdates
    )

    return updatedTransaction
  }
}
