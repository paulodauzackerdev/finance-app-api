import { DeleteTransactionController } from '../../controllers/transactions/delete-transaction-controller.js'

import { DeleteTransactionUseCase } from '../../use-cases/transactions/delete-transaction-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

export const makeDeleteTransactionController = () => {
  const transactionRepository = makeTransactionRepository()

  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    transactionRepository
  )

  return new DeleteTransactionController(deleteTransactionUseCase)
}
