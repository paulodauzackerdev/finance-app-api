import { Router } from 'express'

import { makeCreateUserController } from '../factories/users/make-create-user-controller.js'
import { makeGetAllUsersController } from '../factories/users/make-get-all-users-controller.js'
import { makeGetUserByIdController } from '../factories/users/make-get-user-by-id-controller.js'
import { makeGetUserByEmailController } from '../factories/users/make-get-user-by-email-controller.js'
import { makeUpdateUserController } from '../factories/users/make-update-user-controller.js'
import { makeSoftDeleteUserController } from '../factories/users/make-soft-delete-user-controller.js'
import { makeHardDeleteUserController } from '../factories/users/make-hard-delete-user-controller.js'
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
const getUserBalanceController = makeGetUserBalanceController()
const restoreUserController = makeRestoreUserController()

usersRoutes.get('/', getAllUsersController.handle)
usersRoutes.post('/', createUserController.handle)
usersRoutes.get('/email/:email', getUserByEmailController.handle)

usersRoutes.get('/:id/balance', getUserBalanceController.handle)

usersRoutes.get('/:id', getUserByIdController.handle)
usersRoutes.patch('/:id', updateUserController.handle)
usersRoutes.delete('/:id', deleteUserController.handle)
usersRoutes.delete('/:id/hard', hardDeleteUserController.handle)
usersRoutes.patch('/:id/restore', restoreUserController.handle)

export { usersRoutes }
