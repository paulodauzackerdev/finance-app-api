import { GetUserByEmailController } from '../../controllers/get-user-by-email.js'
import { GetUserByEmailUseCase } from '../../use-cases/get-user-by-email.js'

import { makeUserRepository } from '../repositories/user-repository-factory.js'

export const makeGetUserByEmailController = () => {
  const userRepository = makeUserRepository()

  const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)

  return new GetUserByEmailController(getUserByEmailUseCase)
}
