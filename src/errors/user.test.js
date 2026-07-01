import {
  UserNotFoundError,
  UserAlreadyExistsError,
  UserDeletedError,
  ForbiddenUserDeletionError
} from './user.js'

describe('UserNotFoundError', () => {
  it('should create error with default message', () => {
    const error = new UserNotFoundError()

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('UserNotFoundError')
    expect(error.message).toBe('User not found')
  })

  it('should create error with custom message', () => {
    const error = new UserNotFoundError('Custom message')

    expect(error.message).toBe('Custom message')
  })
})

describe('UserAlreadyExistsError', () => {
  it('should create error with default message', () => {
    const error = new UserAlreadyExistsError()

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('UserAlreadyExistsError')
    expect(error.message).toBe('Email already exists')
  })

  it('should create error with custom message', () => {
    const error = new UserAlreadyExistsError('Custom message')

    expect(error.message).toBe('Custom message')
  })
})

describe('UserDeletedError', () => {
  it('should create error with default message', () => {
    const error = new UserDeletedError()

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('UserDeletedError')
    expect(error.message).toBe(
      'This account has been deactivated and can be restored'
    )
  })

  it('should create error with custom message', () => {
    const error = new UserDeletedError('Custom message')

    expect(error.message).toBe('Custom message')
  })
})

describe('ForbiddenUserDeletionError', () => {
  it('should create error with default message', () => {
    const error = new ForbiddenUserDeletionError()

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ForbiddenUserDeletionError')
    expect(error.message).toBe('Cannot delete this user')
  })

  it('should create error with custom message', () => {
    const error = new ForbiddenUserDeletionError('Custom message')

    expect(error.message).toBe('Custom message')
  })
})
