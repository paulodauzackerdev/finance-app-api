import { LoginController } from '../../controllers/auth/login-controller.js'
import { LoginUseCase } from '../../use-cases/auth/login-use-case.js'
import { makeUserRepository } from '../../repositories/make-user-repository.js'
import { makeRefreshTokenRepository } from '../../repositories/make-refresh-token-repository.js'

export const makeLoginController = () => {
  const userRepository = makeUserRepository()
  const refreshTokenRepository = makeRefreshTokenRepository()
  const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository)

  return new LoginController(loginUseCase)
}
