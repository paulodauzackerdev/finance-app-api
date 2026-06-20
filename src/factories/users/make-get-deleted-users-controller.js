import { GetDeletedUsersController } from '../../controllers/user/get-deleted-users-controller.js'
import { GetDeletedUsersUseCase } from '../../use-cases/user/get-deleted-users-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeGetDeletedUsersController = () => {
  const userRepository = makeUserRepository()

  const getDeletedUsersUseCase = new GetDeletedUsersUseCase(userRepository)

  return new GetDeletedUsersController(getDeletedUsersUseCase)
}
