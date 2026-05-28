import { Router } from 'express'

import { makeCreateTransactionController } from '../factories/transactions/make-create-transaction-controller.js'

const transactionsRoutes = Router()

const createTransactionController = makeCreateTransactionController()

transactionsRoutes.post('/', createTransactionController.handle)

export { transactionsRoutes }
