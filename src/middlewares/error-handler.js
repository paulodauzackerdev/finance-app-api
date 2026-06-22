import { ZodError } from 'zod'

import {
  conflict,
  forbidden,
  internalServerError,
  notFound
} from '../helpers/http.js'

import {
  UserNotFoundError,
  UserAlreadyExistsError,
  ForbiddenUserDeletionError,
  UserDeletedError
} from '../errors/user.js'

import {
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

  // 401
  if (error.name === 'InvalidCredentialsError') {
    return res.status(401).json({ error: error.message })
  }

  // 403
  if (
    error instanceof ForbiddenUserDeletionError ||
    error instanceof TransactionUnauthorizedError
  ) {
    return forbidden(res, error.message)
  }

  // 409
  if (
    error instanceof UserAlreadyExistsError ||
    error instanceof UserDeletedError
  ) {
    return conflict(res, error.message)
  }

  // 400 - Zod validation errors
  if (error instanceof ZodError) {
    const details = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }))

    return res.status(400).json({
      error: 'Validation failed',
      details
    })
  }

  // 500
  console.error(error)

  return internalServerError(res)
}
