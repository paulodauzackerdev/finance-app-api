import { GetTransactionsByUserIdController } from '../../controllers/transactions/get-transactions-by-user-id-controller.js'

import { GetTransactionsByUserIdUseCase } from '../../use-cases/transactions/get-transactions-by-user-id-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeGetTransactionsByUserIdController = () => {
  const transactionRepository = makeTransactionRepository()

  const userRepository = makeUserRepository()

  const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
    transactionRepository,
    userRepository
  )

  return new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)
}
