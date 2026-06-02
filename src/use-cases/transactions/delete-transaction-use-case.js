import validator from 'validator'

import {
  InvalidTransactionIdError,
  TransactionNotFoundError
} from '../../errors/transaction.js'

export class DeleteTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(transactionId) {
    if (!validator.isUUID(transactionId)) {
      throw new InvalidTransactionIdError()
    }

    const existingTransaction =
      await this.transactionRepository.findById(transactionId)

    if (!existingTransaction) {
      throw new TransactionNotFoundError()
    }

    const deletedTransaction =
      await this.transactionRepository.delete(transactionId)

    return deletedTransaction
  }
}
