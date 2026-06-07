import { InvalidTransactionDescriptionError } from '../../errors/transaction.js'

export const validateTransactionDescription = (
  description,
  maxLength = 255
) => {
  if (description === undefined || description === null) {
    return null
  }

  if (typeof description !== 'string') {
    throw new InvalidTransactionDescriptionError('Description must be a string')
  }

  const trimmedDescription = description.trim()

  if (trimmedDescription.length > maxLength) {
    throw new InvalidTransactionDescriptionError(
      `Description must have at most ${maxLength} characters`
    )
  }

  return trimmedDescription || null
}
