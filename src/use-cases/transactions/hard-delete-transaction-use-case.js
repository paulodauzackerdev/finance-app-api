import { transactionIdSchema } from '../../schemas/transaction/transaction.schema.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

export class HardDeleteTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(transactionId) {
    const validatedId = transactionIdSchema.parse(transactionId)

    const existingTransaction =
      await this.transactionRepository.findById(validatedId)

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    const deletedTransaction =
      await this.transactionRepository.hardDelete(validatedId)

    return deletedTransaction
  }
}
