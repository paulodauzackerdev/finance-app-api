import { Router } from 'express'

import { makeCreateTransactionController } from '../factories/transactions/make-create-transaction-controller.js'
import { makeGetTransactionsByUserIdController } from '../factories/transactions/make-get-transactions-by-user-id-controller.js'
import { makeUpdateTransactionController } from '../factories/transactions/make-update-transaction-controller.js'

const transactionsRoutes = Router()

const createTransactionController = makeCreateTransactionController()
const getTransactionsByUserIdController =
  makeGetTransactionsByUserIdController()
const updateTransactionController = makeUpdateTransactionController()

transactionsRoutes.post('/', createTransactionController.handle)

transactionsRoutes.get('/', getTransactionsByUserIdController.handle)

transactionsRoutes.patch('/:id', updateTransactionController.handle)

export { transactionsRoutes }
