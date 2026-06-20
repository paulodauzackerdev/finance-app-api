import {
  updateTransactionInputSchema,
  transactionIdSchema
} from '../../schemas/transaction/transaction.schema.js'

import { TransactionNotFoundError } from '../../errors/transaction.js'

const SPECIAL_FIELDS = {
  amount: (value, existingTransaction) => {
    if (value === Number(existingTransaction.amount)) return null

    return { key: 'amount', value }
  },
  transactionDate: (value, existingTransaction) => {
    const existingDate = existingTransaction.transactionDate
      ? new Date(existingTransaction.transactionDate).toISOString()
      : null

    if (value === existingDate) return null

    return { key: 'transactionDate', value }
  }
}

export class UpdateTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(transactionId, updateParams) {
    const validatedId = transactionIdSchema.parse(transactionId)
    const validatedData = updateTransactionInputSchema.parse(updateParams)

    const existingTransaction =
      await this.transactionRepository.findById(validatedId)

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    const updatesToApply = {}

    for (const [key, value] of Object.entries(validatedData)) {
      if (SPECIAL_FIELDS[key]) {
        const result = SPECIAL_FIELDS[key](value, existingTransaction)

        if (result !== null) {
          updatesToApply[result.key] = result.value
        }
      } else if (value !== existingTransaction[key]) {
        updatesToApply[key] = value
      }
    }

    if (Object.keys(updatesToApply).length === 0) {
      return existingTransaction
    }

    const updatedTransaction = await this.transactionRepository.update(
      validatedId,
      updatesToApply
    )

    return updatedTransaction
  }
}
