import { RefreshTokenController } from '../../controllers/auth/refresh-token-controller.js'
import { RefreshTokenUseCase } from '../../use-cases/auth/refresh-token-use-case.js'
import { makeRefreshTokenRepository } from '../repositories/make-refresh-token-repository.js'
import { makeUserRepository } from '../repositories/make-user-repository.js'

export const makeRefreshTokenController = () => {
  const refreshTokenRepository = makeRefreshTokenRepository()
  const userRepository = makeUserRepository()
  const refreshTokenUseCase = new RefreshTokenUseCase(
    refreshTokenRepository,
    userRepository
  )

  return new RefreshTokenController(refreshTokenUseCase)
}
