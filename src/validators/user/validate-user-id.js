import validator from 'validator'
import { InvalidUserIdError } from '../../errors/user.js'

export const validateUserId = (userId) => {
  if (!validator.isUUID(userId)) {
    throw new InvalidUserIdError()
  }

  return userId
}
