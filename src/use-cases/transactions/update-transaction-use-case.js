import {
  validateTransactionId,
  validateTransactionName,
  validateTransactionAmount,
  validateTransactionType,
  validateTransactionDate,
  validateTransactionDescription
} from '../../validators/transaction/index.js'

import {
  TransactionNotFoundError,
  InvalidTransactionFieldError // ← importa o erro
} from '../../errors/transaction.js'

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

  validateAllowedFields(updateParams) {
    const invalidFields = Object.keys(updateParams).filter(
      (field) => !ALLOWED_UPDATE_FIELDS.includes(field)
    )

    if (invalidFields.length > 0) {
      throw new InvalidTransactionFieldError(
        invalidFields,
        ALLOWED_UPDATE_FIELDS
      )
    }
  }

  async execute(transactionId, updateParams) {
    if (!updateParams || typeof updateParams !== 'object') {
      throw new Error('Update parameters must be an object')
    }

    this.validateAllowedFields(updateParams)

    const validatedId = validateTransactionId(transactionId)

    const existingTransaction =
      await this.transactionRepository.findById(validatedId)

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    const updatesToApply = {}

    if (updateParams.name !== undefined) {
      const validatedName = validateTransactionName(updateParams.name)
      if (validatedName !== existingTransaction.name) {
        updatesToApply.name = validatedName
      }
    }

    if (updateParams.amount !== undefined) {
      const validatedAmount = validateTransactionAmount(updateParams.amount)
      if (validatedAmount !== Number(existingTransaction.amount)) {
        updatesToApply.amount = validatedAmount
      }
    }

    if (updateParams.description !== undefined) {
      const validatedDescription = validateTransactionDescription(
        updateParams.description
      )
      if (validatedDescription !== existingTransaction.description) {
        updatesToApply.description = validatedDescription
      }
    }

    if (updateParams.type !== undefined) {
      const validatedType = validateTransactionType(updateParams.type)
      if (validatedType !== existingTransaction.type) {
        updatesToApply.type = validatedType
      }
    }

    if (updateParams.transaction_date !== undefined) {
      const validatedDate = validateTransactionDate(
        updateParams.transaction_date
      )
      const existingDate = existingTransaction.transaction_date
        ? new Date(existingTransaction.transaction_date).toISOString()
        : null

      if (validatedDate?.toISOString() !== existingDate) {
        updatesToApply.transaction_date = validatedDate
      }
    }

    if (Object.keys(updatesToApply).length === 0) {
      return existingTransaction
    }

    const updatedTransaction = await this.transactionRepository.update(
      transactionId,
      updatesToApply
    )

    return updatedTransaction
  }
}
