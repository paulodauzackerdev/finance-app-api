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

export class UserDeletedError extends Error {
  constructor(
    message = 'This account has been deactivated and can be restored'
  ) {
    super(message)
    this.name = 'UserDeletedError'
  }
}

export class ForbiddenUserDeletionError extends Error {
  constructor(message = 'Cannot delete this user') {
    super(message)
    this.name = 'ForbiddenUserDeletionError'
  }
}

export class ForbiddenUserAccessError extends Error {
  constructor(message = 'You can only access your own data') {
    super(message)
    this.name = 'ForbiddenUserAccessError'
  }
}
