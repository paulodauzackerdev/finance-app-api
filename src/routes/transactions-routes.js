import { Router } from 'express'

import { makeCreateTransactionController } from '../factories/transactions/make-create-transaction-controller.js'
import { makeGetAllTransactionsController } from '../factories/transactions/make-get-all-transactions-controller.js'

const transactionsRoutes = Router()

const createTransactionController = makeCreateTransactionController()
const getAllTransactionsController = makeGetAllTransactionsController()

transactionsRoutes.post('/', createTransactionController.handle)

transactionsRoutes.get('/', getAllTransactionsController.handle)

export { transactionsRoutes }
