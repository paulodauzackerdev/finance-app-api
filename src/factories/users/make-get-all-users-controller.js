import { GetAllUsersController } from '../../controllers/user/get-all-users.js'
import { GetAllUsersUseCase } from '../../use-cases/user/get-all-users.js'

import { makeUserRepository } from '../repositories/user-repository-factory.js'

export const makeGetAllUsersController = () => {
  const userRepository = makeUserRepository()

  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)

  return new GetAllUsersController(getAllUsersUseCase)
}
