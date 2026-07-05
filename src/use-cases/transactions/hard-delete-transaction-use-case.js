import { transactionIdSchema } from '../../schemas/transaction/transaction.schema.js'
import {
  TransactionNotFoundError,
  TransactionUnauthorizedError
} from '../../errors/transaction.js'
export class HardDeleteTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(transactionId, authenticatedUserId, authenticatedUserRole) {
    const validatedId = transactionIdSchema.parse(transactionId)

    const existingTransaction = await this.transactionRepository.findById(
      validatedId,
      true
    )

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    if (
      existingTransaction.userId !== authenticatedUserId &&
      authenticatedUserRole !== 'admin'
    ) {
      throw new TransactionUnauthorizedError()
    }

    const deletedTransaction =
      await this.transactionRepository.hardDelete(validatedId)

    return deletedTransaction
  }
}
