import { SoftDeleteUserController } from '../../controllers/user/soft-delete-user-controller.js'
import { SoftDeleteUserUseCase } from '../../use-cases/user/soft-delete-user-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeSoftDeleteUserController = () => {
  const userRepository = makeUserRepository()

  const softDeleteUserUseCase = new SoftDeleteUserUseCase(userRepository)

  return new SoftDeleteUserController(softDeleteUserUseCase)
}
