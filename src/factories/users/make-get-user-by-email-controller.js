import { GetUserByEmailController } from '../../controllers/user/get-user-by-email-controller.js'
import { GetUserByEmailUseCase } from '../../use-cases/user/get-user-by-email-use-case.js'

import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeGetUserByEmailController = () => {
  const userRepository = makeUserRepository()

  const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)

  return new GetUserByEmailController(getUserByEmailUseCase)
}
