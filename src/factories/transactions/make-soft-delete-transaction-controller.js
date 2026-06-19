import { SoftDeleteTransactionController } from '../../controllers/transactions/soft-delete-transaction-controller.js'

import { SoftDeleteTransactionUseCase } from '../../use-cases/transactions/soft-delete-transaction-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

export const makeSoftDeleteTransactionController = () => {
  const transactionRepository = makeTransactionRepository()

  const softDeleteTransactionUseCase = new SoftDeleteTransactionUseCase(
    transactionRepository
  )

  return new SoftDeleteTransactionController(softDeleteTransactionUseCase)
}
