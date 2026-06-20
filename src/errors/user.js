export class UserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(message = 'Email already exists') {
    super(message)
    this.name = 'UserAlreadyExistsError'
  }
}

export class ForbiddenUserDeletionError extends Error {
  constructor(message = 'Cannot delete this user') {
    super(message)
    this.name = 'ForbiddenUserDeletionError'
  }
}
