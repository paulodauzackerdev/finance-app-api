import { GetAllUsersController } from '../../controllers/user/get-all-users-controller.js'
import { GetAllUsersUseCase } from '../../use-cases/user/get-all-users-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeGetAllUsersController = () => {
  const userRepository = makeUserRepository()

  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)

  return new GetAllUsersController(getAllUsersUseCase)
}
