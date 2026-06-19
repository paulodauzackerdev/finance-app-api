import { HardDeleteTransactionController } from '../../controllers/transactions/hard-delete-transaction-controller.js'

import { HardDeleteTransactionUseCase } from '../../use-cases/transactions/hard-delete-transaction-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

export const makeHardDeleteTransactionController = () => {
  const transactionRepository = makeTransactionRepository()

  const hardDeleteTransactionUseCase = new HardDeleteTransactionUseCase(
    transactionRepository
  )

  return new HardDeleteTransactionController(hardDeleteTransactionUseCase)
}
