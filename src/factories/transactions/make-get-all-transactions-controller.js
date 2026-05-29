import { GetAllTransactionsController } from '../../controllers/transactions/get-all-transactions-controller.js'

import { GetAllTransactionsUseCase } from '../../use-cases/transactions/get-all-transactions-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

export const makeGetAllTransactionsController = () => {
  const transactionRepository = makeTransactionRepository()

  const getAllTransactionsUseCase = new GetAllTransactionsUseCase(
    transactionRepository
  )
  return new GetAllTransactionsController(getAllTransactionsUseCase)
}
