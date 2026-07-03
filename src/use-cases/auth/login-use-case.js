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

    if (!user.role) {
      throw new InvalidCredentialsError()
    }

    const isPasswordValid = await passwordHelper.compare(
      password,
      user.passwordHash
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    const accessToken = jwtHelper.signAccessToken({
      userId: user.id,
      role: user.role
    })

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
