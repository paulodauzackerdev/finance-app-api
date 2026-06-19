import { removePasswordFromUser } from '../../helpers/user.js'

import { userIdSchema } from '../../schemas/user/user.schema.js'

import {
  UserNotFoundError,
  ForbiddenUserDeletionError
} from '../../errors/user.js'

export class SoftDeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    const validatedUserId = userIdSchema.parse(userId)

    const existingUser = await this.userRepository.findById(validatedUserId)

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    if (existingUser.id === process.env.ADMIN_USER_ID) {
      throw new ForbiddenUserDeletionError()
    }

    const deletedUser = await this.userRepository.softDelete(validatedUserId)

    if (!deletedUser) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(deletedUser)
  }
}
