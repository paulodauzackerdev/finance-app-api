import {
  badRequest,
  conflict,
  forbidden,
  internalServerError,
  notFound
} from '../helpers/http.js'

import {
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidNameError,
  InvalidLastNameError,
  InvalidEmailError,
  WeakPasswordError,
  InvalidUserIdError,
  InvalidIsActiveError,
  ForbiddenUserDeletionError
} from '../errors/user.js'

export const errorHandler = (error, req, res, _next) => {
  if (error instanceof UserNotFoundError) {
    return notFound(res, error.message)
  }

  if (error instanceof UserAlreadyExistsError) {
    return conflict(res, error.message)
  }

  if (
    error instanceof InvalidNameError ||
    error instanceof InvalidLastNameError ||
    error instanceof InvalidEmailError ||
    error instanceof WeakPasswordError ||
    error instanceof InvalidUserIdError ||
    error instanceof InvalidIsActiveError
  ) {
    return badRequest(res, error.message)
  }

  if (error instanceof ForbiddenUserDeletionError) {
    return forbidden(res, error.message)
  }

  console.error(error)

  return internalServerError(res)
}
