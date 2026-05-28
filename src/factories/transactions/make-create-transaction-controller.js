import { CreateTransactionController } from '../../controllers/transactions/create-transaction-controller.js'

import { CreateTransactionUseCase } from '../../use-cases/transactions/create-transaction-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'

export const makeCreateTransactionController = () => {
  const userRepository = makeUserRepository()

  const transactionRepository = makeTransactionRepository()

  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository,
    userRepository
  )

  return new CreateTransactionController(createTransactionUseCase)
}
