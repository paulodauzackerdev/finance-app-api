import { Router } from 'express'
import { CreateUserController } from '../controllers/create-user.js'
import { GetUserByIdController } from '../controllers/get-user-by-id.js'
import { GetUserByEmailController } from '../controllers/get-user-by-email.js'
import { UpdateUserController } from '../controllers/update-user.js'
import { GetAllUsersController } from '../controllers/get-all-users.js'
import { DeleteUserController } from '../controllers/delete-user.js'

const usersRoutes = Router()

const createUserController = new CreateUserController()
const getUserByIdController = new GetUserByIdController()
const getUserByEmailController = new GetUserByEmailController()
const updateUserController = new UpdateUserController()
const getAllUsersController = new GetAllUsersController()
const deleteUserController = new DeleteUserController()

usersRoutes.get('/', (req, res) => getAllUsersController.handle(req, res))

usersRoutes.post('/', (req, res) => createUserController.handle(req, res))

usersRoutes.get('/email/:email', (req, res) =>
  getUserByEmailController.handle(req, res)
)
usersRoutes.get('/:id', (req, res) => getUserByIdController.handle(req, res))

usersRoutes.patch('/:id', (req, res) => updateUserController.handle(req, res))

usersRoutes.delete('/:id', (req, res) => deleteUserController.handle(req, res))

export { usersRoutes }
