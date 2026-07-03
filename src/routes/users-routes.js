import { Router } from 'express'

import { authMiddleware } from '../middlewares/auth.js'
import { adminMiddleware } from '../middlewares/admin.js'
import { createUserLimiter } from '../middlewares/rate-limiter.js'

import { makeCreateUserController } from '../factories/users/make-create-user-controller.js'
import { makeGetAllUsersController } from '../factories/users/make-get-all-users-controller.js'
import { makeGetUserByIdController } from '../factories/users/make-get-user-by-id-controller.js'
import { makeGetUserByEmailController } from '../factories/users/make-get-user-by-email-controller.js'
import { makeUpdateUserController } from '../factories/users/make-update-user-controller.js'
import { makeSoftDeleteUserController } from '../factories/users/make-soft-delete-user-controller.js'
import { makeHardDeleteUserController } from '../factories/users/make-hard-delete-user-controller.js'
import { makeGetDeletedUsersController } from '../factories/users/make-get-deleted-users-controller.js'
import { makeGetUserBalanceController } from '../factories/users/make-get-user-balance-controller.js'
import { makeRestoreUserController } from '../factories/users/make-restore-user-controller.js'

const usersRoutes = Router()

const createUserController = makeCreateUserController()
const getAllUsersController = makeGetAllUsersController()
const getUserByIdController = makeGetUserByIdController()
const getUserByEmailController = makeGetUserByEmailController()
const updateUserController = makeUpdateUserController()
const deleteUserController = makeSoftDeleteUserController()
const hardDeleteUserController = makeHardDeleteUserController()
const getDeletedUsersController = makeGetDeletedUsersController()
const getUserBalanceController = makeGetUserBalanceController()
const restoreUserController = makeRestoreUserController()

usersRoutes.post('/', createUserLimiter, createUserController.handle)

usersRoutes.get(
  '/',
  authMiddleware,
  adminMiddleware,
  getAllUsersController.handle
)
usersRoutes.get(
  '/deleted',
  authMiddleware,
  adminMiddleware,
  getDeletedUsersController.handle
)
usersRoutes.get(
  '/email/:email',
  authMiddleware,
  adminMiddleware,
  getUserByEmailController.handle
)
usersRoutes.get('/:id/balance', authMiddleware, getUserBalanceController.handle)
usersRoutes.get('/:id', authMiddleware, getUserByIdController.handle)

usersRoutes.patch(
  '/:id/restore',
  authMiddleware,
  adminMiddleware,
  restoreUserController.handle
)
usersRoutes.patch('/:id', authMiddleware, updateUserController.handle)

usersRoutes.delete(
  '/:id/hard',
  authMiddleware,
  adminMiddleware,
  hardDeleteUserController.handle
)
usersRoutes.delete('/:id', authMiddleware, deleteUserController.handle)

export { usersRoutes }
