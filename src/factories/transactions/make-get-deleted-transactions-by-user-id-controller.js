import { GetDeletedTransactionsByUserIdController } from '../../controllers/transactions/get-deleted-transactions-by-user-id-controller.js'

import { GetDeletedTransactionsByUserIdUseCase } from '../../use-cases/transactions/get-deleted-transactions-by-user-id-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeGetDeletedTransactionsByUserIdController = () => {
  const transactionRepository = makeTransactionRepository()

  const userRepository = makeUserRepository()

  const getDeletedTransactionsByUserIdUseCase =
    new GetDeletedTransactionsByUserIdUseCase(
      transactionRepository,
      userRepository
    )

  return new GetDeletedTransactionsByUserIdController(
    getDeletedTransactionsByUserIdUseCase
  )
}
