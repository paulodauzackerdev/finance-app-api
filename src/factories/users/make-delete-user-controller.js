import { DeleteUserController } from '../../controllers/user/delete-user.js'
import { DeleteUserUseCase } from '../../use-cases/user/delete-user.js'

import { makeUserRepository } from '../repositories/user-repository-factory.js'

export const makeDeleteUserController = () => {
  const userRepository = makeUserRepository()

  const deleteUserUseCase = new DeleteUserUseCase(userRepository)

  return new DeleteUserController(deleteUserUseCase)
}
