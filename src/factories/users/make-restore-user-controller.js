import { RestoreUserController } from '../../controllers/user/restore-user-controller.js'
import { RestoreUserUseCase } from '../../use-cases/user/restore-user-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeRestoreUserController = () => {
  const userRepository = makeUserRepository()

  const restoreUserUseCase = new RestoreUserUseCase(userRepository)

  return new RestoreUserController(restoreUserUseCase)
}
