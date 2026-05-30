import { UpdateTransactionController } from '../../controllers/transactions/update-transaction-controller.js'

import { UpdateTransactionUseCase } from '../../use-cases/transactions/update-transaction-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

export const makeUpdateTransactionController = () => {
  const transactionRepository = makeTransactionRepository()

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    transactionRepository
  )

  return new UpdateTransactionController(updateTransactionUseCase)
}
