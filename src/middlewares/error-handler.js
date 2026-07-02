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

import {
  InvalidCredentialsError,
  InvalidRefreshTokenError
} from '../errors/credentials.js'

export const errorHandler = (error, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`)
  console.error(`  Path: ${req.method} ${req.path}`)

  // 400 - Zod validation errors (antes de qualquer lógica de negócio)
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

  // 401 - Autenticação
  if (
    error instanceof InvalidCredentialsError ||
    error instanceof InvalidRefreshTokenError
  ) {
    return res.status(401).json({ error: error.message })
  }

  // 403 - Autorização
  if (
    error instanceof ForbiddenUserDeletionError ||
    error instanceof TransactionUnauthorizedError ||
    error instanceof UserDeletedError
  ) {
    return forbidden(res, error.message)
  }

  // 404 - Não encontrado
  if (
    error instanceof UserNotFoundError ||
    error instanceof TransactionNotFoundError
  ) {
    return notFound(res, error.message)
  }

  // 409 - Conflito
  if (error instanceof UserAlreadyExistsError) {
    return conflict(res, error.message)
  }

  // 500 - Erro inesperado
  console.error(error)

  return internalServerError(res)
}
