import { Router } from 'express'

import { makeCreateTransactionController } from '../factories/transactions/make-create-transaction-controller.js'
import { makeGetTransactionsByUserIdController } from '../factories/transactions/make-get-transactions-by-user-id-controller.js'
import { makeUpdateTransactionController } from '../factories/transactions/make-update-transaction-controller.js'
import { makeHardDeleteTransactionController } from '../factories/transactions/make-hard-delete-transaction-controller.js'
import { makeSoftDeleteTransactionController } from '../factories/transactions/make-soft-delete-transaction-controller.js'
import { makeRestoreTransactionController } from '../factories/transactions/make-restore-transaction-controller.js'

const transactionsRoutes = Router()

const createTransactionController = makeCreateTransactionController()
const getTransactionsByUserIdController =
  makeGetTransactionsByUserIdController()
const updateTransactionController = makeUpdateTransactionController()
const hardDeleteTransactionController = makeHardDeleteTransactionController()
const softDeleteTransactionController = makeSoftDeleteTransactionController()
const restoreTransactionController = makeRestoreTransactionController()

transactionsRoutes.post('/', createTransactionController.handle)

transactionsRoutes.get('/', getTransactionsByUserIdController.handle)

transactionsRoutes.patch('/:id', updateTransactionController.handle)

transactionsRoutes.delete('/:id/hard', hardDeleteTransactionController.handle)
transactionsRoutes.delete('/:id', softDeleteTransactionController.handle)
transactionsRoutes.patch('/:id/restore', restoreTransactionController.handle)

export { transactionsRoutes }
