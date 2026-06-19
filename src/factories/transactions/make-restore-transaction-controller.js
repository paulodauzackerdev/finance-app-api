import { RestoreTransactionController } from '../../controllers/transactions/restore-transaction-controller.js'

import { RestoreTransactionUseCase } from '../../use-cases/transactions/restore-transaction-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

export const makeRestoreTransactionController = () => {
  const transactionRepository = makeTransactionRepository()

  const restoreTransactionUseCase = new RestoreTransactionUseCase(
    transactionRepository
  )

  return new RestoreTransactionController(restoreTransactionUseCase)
}
