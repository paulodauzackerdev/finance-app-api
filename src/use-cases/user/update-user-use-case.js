import { removePasswordFromUser } from '../../helpers/user.js'
import { hashPassword } from '../../helpers/password.js'

import {
  validateEmail,
  validateName,
  validatePassword,
  validateUserId
} from '../../validators/user/index.js'

import {
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidIsActiveError,
  InvalidUpdateFieldError
} from '../../errors/user.js'
export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  validateAllowedFields(updateParams) {
    const allowedFields = ['first_name', 'last_name', 'email', 'password']
    const invalidFields = Object.keys(updateParams).filter(
      (field) => !allowedFields.includes(field)
    )

    if (invalidFields.length > 0) {
      throw new InvalidUpdateFieldError(invalidFields, allowedFields)
    }
  }
  async execute(userId, updateParams) {
    if (!updateParams || typeof updateParams !== 'object') {
      throw new Error('Update parameters must be an object')
    }
    this.validateAllowedFields(updateParams)

    validateUserId(userId)

    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    const updatesToApply = {}

    if (updateParams.first_name !== undefined) {
      const firstName = validateName(updateParams.first_name, 'First name')

      if (firstName !== existingUser.first_name) {
        updatesToApply.first_name = firstName
      }
    }

    if (updateParams.last_name !== undefined) {
      const lastName = validateName(updateParams.last_name, 'Last name')

      if (lastName !== existingUser.last_name) {
        updatesToApply.last_name = lastName
      }
    }

    if (updateParams.email !== undefined) {
      const normalizedEmail = validateEmail(updateParams.email)

      if (normalizedEmail !== existingUser.email) {
        const emailAlreadyExists =
          await this.userRepository.findByEmail(normalizedEmail)

        if (emailAlreadyExists && emailAlreadyExists.id !== existingUser.id) {
          throw new UserAlreadyExistsError()
        }

        updatesToApply.email = normalizedEmail
      }
    }

    if (updateParams.password !== undefined) {
      const validatedPassword = validatePassword(updateParams.password)

      updatesToApply.password_hash = await hashPassword(validatedPassword)
    }

    if (updateParams.is_active !== undefined) {
      if (typeof updateParams.is_active !== 'boolean') {
        throw new InvalidIsActiveError()
      }

      if (updateParams.is_active !== existingUser.is_active) {
        updatesToApply.is_active = updateParams.is_active
      }
    }

    if (Object.keys(updatesToApply).length === 0) {
      return removePasswordFromUser(existingUser)
    }

    const updatedUser = await this.userRepository.update(userId, updatesToApply)

    return removePasswordFromUser(updatedUser)
  }
}
