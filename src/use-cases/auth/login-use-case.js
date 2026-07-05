import { passwordHelper } from '../../helpers/password.js'
import { jwtHelper } from '../../helpers/jwt.js'
import { removePasswordFromUser } from '../../helpers/user.js'

import { loginInputSchema } from '../../schemas/auth/auth.schema.js'

import { InvalidCredentialsError } from '../../errors/credentials.js'

export class LoginUseCase {
  constructor(userRepository, refreshTokenRepository) {
    this.userRepository = userRepository
    this.refreshTokenRepository = refreshTokenRepository
  }

  async execute(loginParams) {
    const { email, password } = loginInputSchema.parse(loginParams)

    const user = await this.userRepository.findByEmail(email, true)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Password compare ANTES da verificação de role
    // para evitar timing attack (mesmo tempo para usuários com/sem role)
    const isPasswordValid = await passwordHelper.compare(
      password,
      user.passwordHash
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    // Proteção extra contra dados inconsistentes no banco
    // Mantida APÓS o password compare para evitar timing attack
    if (!user.role) {
      throw new InvalidCredentialsError()
    }

    // Gera access token (JWT)
    const accessToken = jwtHelper.signAccessToken({
      userId: user.id,
      role: user.role
    })

    // Gera refresh token (random + hash no banco)
    const refreshToken = jwtHelper.generateRefreshToken()
    const tokenHash = jwtHelper.hashRefreshToken(refreshToken)
    const expiresAt = jwtHelper.getRefreshExpiresAt()

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt
    })

    return {
      accessToken,
      refreshToken,
      user: removePasswordFromUser(user)
    }
  }
}
