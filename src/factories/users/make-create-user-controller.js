import { CreateUserController } from '../../controllers/user/create-user-controller.js'
import { CreateUserUseCase } from '../../use-cases/user/create-user-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeCreateUserController = () => {
  const userRepository = makeUserRepository()
  const createUserUseCase = new CreateUserUseCase(userRepository)

  return new CreateUserController(createUserUseCase)
}
