import { UpdateUserController } from '../../controllers/user/update-user-controller.js'
import { UpdateUserUseCase } from '../../use-cases/user/update-user-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeUpdateUserController = () => {
  const userRepository = makeUserRepository()

  const updateUserUseCase = new UpdateUserUseCase(userRepository)

  return new UpdateUserController(updateUserUseCase)
}
