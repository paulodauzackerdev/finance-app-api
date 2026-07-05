import { jwtHelper } from '../../helpers/jwt.js'
import { refreshTokenInputSchema } from '../../schemas/auth/auth.schema.js'

export class LogoutUseCase {
  constructor(refreshTokenRepository) {
    this.refreshTokenRepository = refreshTokenRepository
  }

  async execute(refreshParams) {
    const { refreshToken } = refreshTokenInputSchema.parse(refreshParams)

    const tokenHash = jwtHelper.hashRefreshToken(refreshToken)

    const storedToken = await this.refreshTokenRepository.findByHash(tokenHash)

    if (storedToken && !storedToken.revokedAt) {
      await this.refreshTokenRepository.revoke(storedToken.id)

      console.info(
        `[Auth] Refresh token revogado: userId=${storedToken.userId}`
      )
    }

    return { message: 'Logged out successfully' }
  }
}
