import { GetUserByIdController } from '../../controllers/user/get-user-by-id.js'
import { GetUserByIdUseCase } from '../../use-cases/user/get-user-by-id.js'

import { makeUserRepository } from '../repositories/user-repository-factory.js'

export const makeGetUserByIdController = () => {
  const userRepository = makeUserRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)

  return new GetUserByIdController(getUserByIdUseCase)
}
