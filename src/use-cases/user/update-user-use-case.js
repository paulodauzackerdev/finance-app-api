import { removePasswordFromUser } from '../../helpers/user.js'

import { passwordHelper } from '../../helpers/password.js'

import {
  updateUserInputSchema,
  userIdSchema
} from '../../schemas/user/user.schema.js'

import { UserNotFoundError, UserAlreadyExistsError } from '../../errors/user.js'

export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId, updateParams) {
    const validatedUserId = userIdSchema.parse(userId)
    const validatedData = updateUserInputSchema.parse(updateParams)

    const existingUser = await this.userRepository.findById(validatedUserId)

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    const updatesToApply = {}

    if (
      validatedData.firstName !== undefined &&
      validatedData.firstName !== existingUser.firstName
    ) {
      updatesToApply.firstName = validatedData.firstName
    }

    if (
      validatedData.lastName !== undefined &&
      validatedData.lastName !== existingUser.lastName
    ) {
      updatesToApply.lastName = validatedData.lastName
    }

    if (
      validatedData.email !== undefined &&
      validatedData.email !== existingUser.email
    ) {
      const emailAlreadyExists = await this.userRepository.findByEmail(
        validatedData.email
      )

      if (emailAlreadyExists && emailAlreadyExists.id !== existingUser.id) {
        throw new UserAlreadyExistsError()
      }

      updatesToApply.email = validatedData.email
    }

    if (validatedData.password !== undefined) {
      updatesToApply.passwordHash = await passwordHelper.hash(
        validatedData.password
      )
    }

    if (Object.keys(updatesToApply).length === 0) {
      return removePasswordFromUser(existingUser)
    }

    const updatedUser = await this.userRepository.update(
      validatedUserId,
      updatesToApply
    )

    return removePasswordFromUser(updatedUser)
  }
}
