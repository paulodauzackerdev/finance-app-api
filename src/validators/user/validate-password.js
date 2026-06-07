import validator from 'validator'
import { WeakPasswordError } from '../../errors/user.js'

export const validatePassword = (password) => {
  if (typeof password !== 'string') {
    throw new WeakPasswordError('Password must be a string')
  }

  const trimmedPassword = password.trim()

  if (!trimmedPassword) {
    throw new WeakPasswordError('Password is required')
  }

  if (!validator.isLength(trimmedPassword, { min: 6 })) {
    throw new WeakPasswordError('Password must have at least 6 characters')
  }

  return trimmedPassword
}
