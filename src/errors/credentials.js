export class InvalidCredentialsError extends Error {
  constructor(message = 'Invalid email or password') {
    super(message)
    this.name = 'InvalidCredentialsError'
  }
}

export class JwtSecretUndefinedError extends Error {
  constructor(message = 'JWT_SECRET is not defined in environment variables') {
    super(message)
    this.name = 'JwtSecretUndefinedError'
  }
}

export class InvalidRefreshTokenError extends Error {
  constructor(message = 'Invalid or expired refresh token') {
    super(message)
    this.name = 'InvalidRefreshTokenError'
  }
}
