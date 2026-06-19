import { ZodError } from 'zod'

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
  ForbiddenUserDeletionError,
  MissingUserFieldsError,
  InvalidUpdateFieldError
} from '../errors/user.js'

import {
  InvalidTransactionIdError,
  InvalidTransactionNameError,
  InvalidTransactionAmountError,
  InvalidTransactionTypeError,
  InvalidTransactionDateError,
  InvalidTransactionDescriptionError,
  InvalidTransactionFieldError,
  TransactionNotFoundError,
  TransactionUnauthorizedError
} from '../errors/transaction.js'

export const errorHandler = (error, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`)
  console.error(`  Path: ${req.method} ${req.path}`)

  // 404
  if (
    error instanceof UserNotFoundError ||
    error instanceof TransactionNotFoundError
  ) {
    return notFound(res, error.message)
  }

  // 403
  if (
    error instanceof ForbiddenUserDeletionError ||
    error instanceof TransactionUnauthorizedError
  ) {
    return forbidden(res, error.message)
  }

  // 409
  if (error instanceof UserAlreadyExistsError) {
    return conflict(res, error.message)
  }

  // 400 - Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }))

    return res.status(400).json({
      error: 'Validation failed',
      details
    })
  }

  if (
    error instanceof MissingUserFieldsError ||
    error instanceof InvalidNameError ||
    error instanceof InvalidLastNameError ||
    error instanceof InvalidEmailError ||
    error instanceof WeakPasswordError ||
    error instanceof InvalidUserIdError ||
    error instanceof InvalidIsActiveError ||
    error instanceof InvalidUpdateFieldError ||
    error instanceof InvalidTransactionIdError ||
    error instanceof InvalidTransactionFieldError ||
    error instanceof InvalidTransactionNameError ||
    error instanceof InvalidTransactionAmountError ||
    error instanceof InvalidTransactionTypeError ||
    error instanceof InvalidTransactionDateError ||
    error instanceof InvalidTransactionDescriptionError
  ) {
    return badRequest(res, error.message)
  }

  // 500
  console.error(error)

  return internalServerError(res)
}
