import { Router } from 'express'

import { makeCreateUserController } from '../factories/users/make-create-user-controller.js'
import { makeGetAllUsersController } from '../factories/users/make-get-all-users-controller.js'
import { makeGetUserByIdController } from '../factories/users/make-get-user-by-id-controller.js'
import { makeGetUserByEmailController } from '../factories/users/make-get-user-by-email-controller.js'
import { makeUpdateUserController } from '../factories/users/make-update-user-controller.js'
import { makeDeleteUserController } from '../factories/users/make-delete-user-controller.js'

const usersRoutes = Router()

const createUserController = makeCreateUserController()
const getAllUsersController = makeGetAllUsersController()
const getUserByIdController = makeGetUserByIdController()
const getUserByEmailController = makeGetUserByEmailController()
const updateUserController = makeUpdateUserController()
const deleteUserController = makeDeleteUserController()

usersRoutes.get('/', getAllUsersController.handle)

usersRoutes.post('/', createUserController.handle)

usersRoutes.get('/email/:email', getUserByEmailController.handle)

usersRoutes.get('/:id', getUserByIdController.handle)

usersRoutes.patch('/:id', updateUserController.handle)

usersRoutes.delete('/:id', deleteUserController.handle)

export { usersRoutes }
