import validator from 'validator'
import { InvalidNameError } from '../../errors/user.js'

export const validateName = (name, fieldName = 'Name', min = 1, max = 50) => {
  if (typeof name !== 'string') {
    throw new InvalidNameError(`${fieldName} must be a string`)
  }

  const trimmedName = name.trim()

  if (!trimmedName) {
    throw new InvalidNameError(`${fieldName} is required`)
  }

  if (!validator.isLength(trimmedName, { min, max })) {
    throw new InvalidNameError(
      `${fieldName} must have between ${min} and ${max} characters`
    )
  }

  return trimmedName
}
