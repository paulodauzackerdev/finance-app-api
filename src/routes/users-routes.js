import { Router } from 'express'

import { CreateUserController } from '../controllers/create-user.js'
import { GetUserByIdController } from '../controllers/get-user-by-id.js'
import { GetUserByEmailController } from '../controllers/get-user-by-email.js'
import { UpdateUserController } from '../controllers/update-user.js'
import { GetAllUsersController } from '../controllers/get-all-users.js'
import { DeleteUserController } from '../controllers/delete-user.js'

import { CreateUserUseCase } from '../use-cases/create-user.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { GetUserByEmailUseCase } from '../use-cases/get-user-by-email.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { GetAllUsersUseCase } from '../use-cases/get-all-users.js'
import { DeleteUserUseCase } from '../use-cases/delete-user.js'

import { UserRepository } from '../repositories/postgres/postgres-user-repository.js'

const usersRoutes = Router()

const userRepository = new UserRepository()

const createUserUseCase = new CreateUserUseCase(userRepository)
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userRepository)
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)
const deleteUserUseCase = new DeleteUserUseCase(userRepository)

const createUserController = new CreateUserController(createUserUseCase)
const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)
const getUserByEmailController = new GetUserByEmailController(
  getUserByEmailUseCase
)
const updateUserController = new UpdateUserController(updateUserUseCase)
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

// routes
usersRoutes.get('/', (req, res) => getAllUsersController.handle(req, res))

usersRoutes.post('/', (req, res) => createUserController.handle(req, res))

usersRoutes.get('/email/:email', (req, res) =>
  getUserByEmailController.handle(req, res)
)

usersRoutes.get('/:id', (req, res) => getUserByIdController.handle(req, res))

usersRoutes.patch('/:id', (req, res) => updateUserController.handle(req, res))

usersRoutes.delete('/:id', (req, res) => deleteUserController.handle(req, res))

export { usersRoutes }
