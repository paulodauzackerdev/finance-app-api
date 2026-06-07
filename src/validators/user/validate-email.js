import validator from 'validator'
import { InvalidEmailError } from '../../errors/user.js'

export const validateEmail = (email) => {
  if (typeof email !== 'string') {
    throw new InvalidEmailError('Email must be a string')
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    throw new InvalidEmailError('Email is required')
  }
  if (normalizedEmail.length > 150) {
    throw new InvalidEmailError('Email is too long (max 150 characters)')
  }
  if (!validator.isEmail(normalizedEmail)) {
    throw new InvalidEmailError('Invalid email format')
  }

  return normalizedEmail
}
