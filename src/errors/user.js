export class MissingUserFieldsError extends Error {
  constructor(message = 'All fields are required') {
    super(message)
    this.name = 'MissingUserFieldsError'
  }
}

export class InvalidNameError extends Error {
  constructor(message = 'Invalid name') {
    super(message)
    this.name = 'InvalidNameError'
  }
}

export class InvalidLastNameError extends Error {
  constructor(message = 'Invalid last name') {
    super(message)
    this.name = 'InvalidLastNameError'
  }
}

export class InvalidEmailError extends Error {
  constructor(message = 'Invalid email') {
    super(message)
    this.name = 'InvalidEmailError'
  }
}

export class WeakPasswordError extends Error {
  constructor(message = 'Password too weak') {
    super(message)
    this.name = 'WeakPasswordError'
  }
}

export class InvalidIsActiveError extends Error {
  constructor(message = 'is_active must be a boolean') {
    super(message)
    this.name = 'InvalidIsActiveError'
  }
}

export class InvalidUserIdError extends Error {
  constructor(message = 'Invalid user ID') {
    super(message)
    this.name = 'InvalidUserIdError'
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(message = 'Email already exists') {
    super(message)
    this.name = 'UserAlreadyExistsError'
  }
}

export class UserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export class UsersNotFoundError extends Error {
  constructor(message = 'Users not found') {
    super(message)
    this.name = 'UsersNotFoundError'
  }
}

export class ForbiddenUserDeletionError extends Error {
  constructor(message = 'Cannot delete this user') {
    super(message)
    this.name = 'ForbiddenUserDeletionError'
  }
}
