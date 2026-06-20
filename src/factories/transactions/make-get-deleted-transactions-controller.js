import { GetDeletedTransactionsController } from '../../controllers/transactions/get-deleted-transactions-controller.js'
import { GetDeletedTransactionsUseCase } from '../../use-cases/transactions/get-deleted-transactions-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

export const makeGetDeletedTransactionsController = () => {
  const transactionRepository = makeTransactionRepository()

  const getDeletedTransactionsUseCase = new GetDeletedTransactionsUseCase(
    transactionRepository
  )

  return new GetDeletedTransactionsController(getDeletedTransactionsUseCase)
}
