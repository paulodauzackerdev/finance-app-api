import validator from 'validator'

import {
  InvalidTransactionNameError,
  InvalidTransactionAmountError,
  InvalidTransactionTypeError,
  InvalidTransactionDateError,
  InvalidTransactionDescriptionError
} from '../../errors/transaction.js'

import { UserNotFoundError, InvalidUserIdError } from '../../errors/user.js'

export class CreateTransactionUseCase {
  constructor(transactionRepository, userRepository) {
    this.transactionRepository = transactionRepository
    this.userRepository = userRepository
  }

  async execute({
    user_id,
    name,
    amount,
    description,
    type,
    transaction_date
  }) {
    if (!validator.isUUID(user_id)) {
      throw new InvalidUserIdError()
    }

    const user = await this.userRepository.findById(user_id)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (typeof name !== 'string') {
      throw new InvalidTransactionNameError('Transaction name must be a string')
    }

    const trimmedName = name.trim()

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

    if (typeof amount !== 'number' || Number.isNaN(amount)) {
      throw new InvalidTransactionAmountError('Amount must be a valid number')
    }

    if (!Number.isFinite(amount)) {
      throw new InvalidTransactionAmountError('Amount must be a finite number')
    }

    if (amount <= 0) {
      throw new InvalidTransactionAmountError(
        'Amount must be greater than zero'
      )
    }

    const amountInCents = amount * 100

    if (!Number.isInteger(amountInCents)) {
      throw new InvalidTransactionAmountError(
        'Amount must have at most 2 decimal places'
      )
    }

    const finalAmount = Number(amount.toFixed(2))

    let normalizedDescription = null

    if (description !== undefined) {
      if (typeof description !== 'string') {
        throw new InvalidTransactionDescriptionError(
          'Description must be a string'
        )
      }

      normalizedDescription = description.trim() || null
    }

    const allowedTypes = ['income', 'expense', 'investment']

    if (typeof type !== 'string') {
      throw new InvalidTransactionTypeError('Transaction type must be a string')
    }

    if (!allowedTypes.includes(type)) {
      throw new InvalidTransactionTypeError(
        `Transaction type must be one of: ${allowedTypes.join(', ')}`
      )
    }

    let normalizedTransactionDate = new Date()

    if (transaction_date !== undefined) {
      const parsedDate = new Date(transaction_date)

      if (Number.isNaN(parsedDate.getTime())) {
        throw new InvalidTransactionDateError('Invalid transaction date')
      }

      normalizedTransactionDate = parsedDate
    }

    const transaction = await this.transactionRepository.create({
      user_id,
      name: trimmedName,
      amount: finalAmount,
      description: normalizedDescription,
      type,
      transaction_date: normalizedTransactionDate
    })
    return transaction
  }
}
