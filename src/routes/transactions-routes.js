import { Router } from 'express'

import { authMiddleware } from '../middlewares/auth.js'
import { adminMiddleware } from '../middlewares/admin.js'

import { makeCreateTransactionController } from '../factories/transactions/make-create-transaction-controller.js'
import { makeGetTransactionsByUserIdController } from '../factories/transactions/make-get-transactions-by-user-id-controller.js'
import { makeUpdateTransactionController } from '../factories/transactions/make-update-transaction-controller.js'
import { makeHardDeleteTransactionController } from '../factories/transactions/make-hard-delete-transaction-controller.js'
import { makeSoftDeleteTransactionController } from '../factories/transactions/make-soft-delete-transaction-controller.js'
import { makeRestoreTransactionController } from '../factories/transactions/make-restore-transaction-controller.js'
import { makeGetDeletedTransactionsController } from '../factories/transactions/make-get-deleted-transactions-controller.js'
import { makeGetDeletedTransactionsByUserIdController } from '../factories/transactions/make-get-deleted-transactions-by-user-id-controller.js'

const transactionsRoutes = Router()

const createTransactionController = makeCreateTransactionController()
const getTransactionsByUserIdController =
  makeGetTransactionsByUserIdController()
const updateTransactionController = makeUpdateTransactionController()
const hardDeleteTransactionController = makeHardDeleteTransactionController()
const softDeleteTransactionController = makeSoftDeleteTransactionController()
const restoreTransactionController = makeRestoreTransactionController()
const getDeletedTransactionsController = makeGetDeletedTransactionsController()
const getDeletedTransactionsByUserIdController =
  makeGetDeletedTransactionsByUserIdController()

// ═══════════ READ ═══════════
transactionsRoutes.get(
  '/deleted',
  authMiddleware,
  adminMiddleware,
  getDeletedTransactionsController.handle
)
transactionsRoutes.get(
  '/deleted/:userId',
  authMiddleware,
  adminMiddleware,
  getDeletedTransactionsByUserIdController.handle
)
transactionsRoutes.get(
  '/',
  authMiddleware,
  getTransactionsByUserIdController.handle
)

// ═══════════ CREATE ═══════════
transactionsRoutes.post('/', authMiddleware, createTransactionController.handle)

// ═══════════ UPDATE ═══════════
transactionsRoutes.patch(
  '/:id/restore',
  authMiddleware,
  adminMiddleware,
  restoreTransactionController.handle
)
transactionsRoutes.patch(
  '/:id',
  authMiddleware,
  updateTransactionController.handle
)

// ═══════════ DELETE ═══════════
transactionsRoutes.delete(
  '/:id/hard',
  authMiddleware,
  adminMiddleware,
  hardDeleteTransactionController.handle
)
transactionsRoutes.delete(
  '/:id',
  authMiddleware,
  softDeleteTransactionController.handle
)

export { transactionsRoutes }
