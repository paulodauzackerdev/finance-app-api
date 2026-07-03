import { jwtHelper } from '../../helpers/jwt.js'

import { refreshTokenInputSchema } from '../../schemas/auth/auth.schema.js'

import { InvalidRefreshTokenError } from '../../errors/credentials.js'

export class RefreshTokenUseCase {
  constructor(refreshTokenRepository, userRepository) {
    this.refreshTokenRepository = refreshTokenRepository
    this.userRepository = userRepository
  }

  async execute(refreshParams) {
    const { refreshToken } = refreshTokenInputSchema.parse(refreshParams)

    const tokenHash = jwtHelper.hashRefreshToken(refreshToken)

    const storedToken = await this.refreshTokenRepository.findByHash(tokenHash)

    if (!storedToken) {
      throw new InvalidRefreshTokenError()
    }

    if (storedToken.revokedAt) {
      await this.refreshTokenRepository.revokeAllByUserId(storedToken.userId)
      throw new InvalidRefreshTokenError()
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      throw new InvalidRefreshTokenError()
    }

    await this.refreshTokenRepository.revoke(storedToken.id)

    const user = await this.userRepository.findById(storedToken.userId, true)

    if (!user || !user.role) {
      throw new InvalidRefreshTokenError()
    }

    const newAccessToken = jwtHelper.signAccessToken({
      userId: user.id,
      role: user.role
    })

    const newRefreshToken = jwtHelper.generateRefreshToken()
    const newTokenHash = jwtHelper.hashRefreshToken(newRefreshToken)
    const newExpiresAt = jwtHelper.getRefreshExpiresAt()

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}
