import { UpdateUserController } from '../../controllers/update-user.js'
import { UpdateUserUseCase } from '../../use-cases/update-user.js'

import { makeUserRepository } from '../repositories/user-repository-factory.js'

export const makeUpdateUserController = () => {
  const userRepository = makeUserRepository()

  const updateUserUseCase = new UpdateUserUseCase(userRepository)

  return new UpdateUserController(updateUserUseCase)
}
