import { TransactionRepository } from '../../repositories/postgres/postgres-transaction-repository.js'

export const makeTransactionRepository = () => {
  return new TransactionRepository()
}
