import { removePasswordFromUser } from '../../helpers/user.js'

import { userIdSchema } from '../../schemas/user/user.schema.js'

import {
  UserNotFoundError,
  ForbiddenUserDeletionError,
  ForbiddenUserAccessError
} from '../../errors/user.js'

export class HardDeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId, authenticatedUserId, authenticatedUserRole) {
    const validatedUserId = userIdSchema.parse(userId)

    if (authenticatedUserRole !== 'admin') {
      throw new ForbiddenUserAccessError()
    }

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

    await this.userRepository.hardDelete(validatedUserId)

    return removePasswordFromUser(existingUser)
  }
}
