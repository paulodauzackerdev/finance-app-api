import { GetUserBalanceController } from '../../controllers/user/get-user-balance-controller.js'
import { GetUserBalanceUseCase } from '../../use-cases/user/get-user-balance-use-case.js'

import { makeTransactionRepository } from '../repositories/make-transaction-repository.js'
import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeGetUserBalanceController = () => {
  const transactionRepository = makeTransactionRepository()

  const userRepository = makeUserRepository()

  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    transactionRepository,
    userRepository
  )

  return new GetUserBalanceController(getUserBalanceUseCase)
}
