import {
  updateTransactionInputSchema,
  transactionIdSchema
} from '../../schemas/transaction/transaction.schema.js'

import { TransactionNotFoundError } from '../../errors/transaction.js'

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

    if (
      validatedData.name !== undefined &&
      validatedData.name !== existingTransaction.name
    ) {
      updatesToApply.name = validatedData.name
    }

    if (
      validatedData.amount !== undefined &&
      validatedData.amount !== Number(existingTransaction.amount)
    ) {
      updatesToApply.amount = validatedData.amount
    }

    if (
      validatedData.description !== undefined &&
      validatedData.description !== existingTransaction.description
    ) {
      updatesToApply.description = validatedData.description
    }

    if (
      validatedData.type !== undefined &&
      validatedData.type !== existingTransaction.type
    ) {
      updatesToApply.type = validatedData.type
    }

    if (validatedData.transactionDate !== undefined) {
      const validatedDate = validatedData.transactionDate
      const existingDate = existingTransaction.transactionDate
        ? new Date(existingTransaction.transactionDate).toISOString()
        : null

      if (validatedDate !== existingDate) {
        updatesToApply.transactionDate = validatedDate
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
