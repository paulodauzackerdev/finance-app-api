import { transactionIdSchema } from '../../schemas/transaction/transaction.schema.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

export class RestoreTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(transactionId) {
    const validatedId = transactionIdSchema.parse(transactionId)

    const existingTransaction = await this.transactionRepository.findById(
      validatedId,
      true
    )

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    const restoredTransaction =
      await this.transactionRepository.restore(validatedId)

    return restoredTransaction
  }
}
