import { LogoutController } from '../../controllers/auth/logout-controller.js'
import { LogoutUseCase } from '../../use-cases/auth/logout-use-case.js'
import { makeRefreshTokenRepository } from '../repositories/make-refresh-token-repository.js'

export const makeLogoutController = () => {
  const refreshTokenRepository = makeRefreshTokenRepository()
  const logoutUseCase = new LogoutUseCase(refreshTokenRepository)

  return new LogoutController(logoutUseCase)
}
