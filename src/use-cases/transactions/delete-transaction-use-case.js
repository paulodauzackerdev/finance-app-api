import { validateTransactionId } from '../../validators/transaction/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

export class DeleteTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(transactionId) {
    const validatedId = validateTransactionId(transactionId)

    const existingTransaction =
      await this.transactionRepository.findById(validatedId)

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    const deletedTransaction =
      await this.transactionRepository.delete(validatedId)

    return deletedTransaction
  }
}
