import { GetUserByIdController } from '../../controllers/user/get-user-by-id-controller.js'
import { GetUserByIdUseCase } from '../../use-cases/user/get-user-by-id-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeGetUserByIdController = () => {
  const userRepository = makeUserRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)

  return new GetUserByIdController(getUserByIdUseCase)
}
