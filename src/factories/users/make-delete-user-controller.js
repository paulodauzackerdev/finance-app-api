import { DeleteUserController } from '../../controllers/user/delete-user-controller.js'
import { DeleteUserUseCase } from '../../use-cases/user/delete-user-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeDeleteUserController = () => {
  const userRepository = makeUserRepository()

  const deleteUserUseCase = new DeleteUserUseCase(userRepository)

  return new DeleteUserController(deleteUserUseCase)
}
