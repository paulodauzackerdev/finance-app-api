import { Router } from 'express'

import { makeCreateTransactionController } from '../factories/transactions/make-create-transaction-controller.js'
import { makeGetTransactionsByUserIdController } from '../factories/transactions/make-get-transactions-by-user-id-controller.js'

const transactionsRoutes = Router()

const createTransactionController = makeCreateTransactionController()
const getTransactionsByUserIdController =
  makeGetTransactionsByUserIdController()

transactionsRoutes.post('/', createTransactionController.handle)

transactionsRoutes.get('/', getTransactionsByUserIdController.handle)

export { transactionsRoutes }
