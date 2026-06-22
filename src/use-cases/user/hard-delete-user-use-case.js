import { removePasswordFromUser } from '../../helpers/user.js'

import { userIdSchema } from '../../schemas/user/user.schema.js'

import {
  UserNotFoundError,
  ForbiddenUserDeletionError
} from '../../errors/user.js'

export class HardDeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    const validatedUserId = userIdSchema.parse(userId)

    const existingUser = await this.userRepository.findById(
      validatedUserId,
      true
    )

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    const adminUserId = process.env.ADMIN_USER_ID

    if (adminUserId && existingUser.id === adminUserId) {
      throw new ForbiddenUserDeletionError()
    }

    const hardDeletedUser =
      await this.userRepository.hardDelete(validatedUserId)

    if (!hardDeletedUser) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(hardDeletedUser)
  }
}
