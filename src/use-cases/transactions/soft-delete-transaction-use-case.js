import { transactionIdSchema } from '../../schemas/transaction/transaction.schema.js'
import {
  TransactionNotFoundError,
  TransactionUnauthorizedError
} from '../../errors/transaction.js'

export class SoftDeleteTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(transactionId, authenticatedUserId) {
    const validatedId = transactionIdSchema.parse(transactionId)

    const existingTransaction =
      await this.transactionRepository.findById(validatedId)

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    if (existingTransaction.userId !== authenticatedUserId) {
      throw new TransactionUnauthorizedError()
    }

    const deletedTransaction =
      await this.transactionRepository.softDelete(validatedId)

    return deletedTransaction
  }
}
