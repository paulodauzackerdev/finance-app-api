import { CreateUserController } from '../../controllers/create-user.js'
import { CreateUserUseCase } from '../../use-cases/create-user.js'

import { makeUserRepository } from '../repositories/user-repository-factory.js'

export const makeCreateUserController = () => {
  const userRepository = makeUserRepository()
  const createUserUseCase = new CreateUserUseCase(userRepository)

  return new CreateUserController(createUserUseCase)
}
