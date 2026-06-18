import { HardDeleteUserController } from '../../controllers/user/hard-delete-user-controller.js'
import { HardDeleteUserUseCase } from '../../use-cases/user/hard-delete-user-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeHardDeleteUserController = () => {
  const userRepository = makeUserRepository()

  const hardDeleteUserUseCase = new HardDeleteUserUseCase(userRepository)

  return new HardDeleteUserController(hardDeleteUserUseCase)
}
