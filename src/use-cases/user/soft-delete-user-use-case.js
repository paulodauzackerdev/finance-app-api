import { removePasswordFromUser } from '../../helpers/user.js'

import { userIdSchema } from '../../schemas/user/user.schema.js'

import {
  UserNotFoundError,
  ForbiddenUserAccessError,
  ForbiddenUserDeletionError
} from '../../errors/user.js'

export class SoftDeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId, authenticatedUserId, authenticatedUserRole) {
    const validatedUserId = userIdSchema.parse(userId)

    if (
      authenticatedUserRole !== 'admin' &&
      validatedUserId !== authenticatedUserId
    ) {
      throw new ForbiddenUserAccessError()
    }

    const adminUserId = process.env.ADMIN_USER_ID

    if (adminUserId && validatedUserId === adminUserId) {
      throw new ForbiddenUserDeletionError()
    }

    const existingUser = await this.userRepository.findById(validatedUserId)

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    const deletedUser = await this.userRepository.softDelete(validatedUserId)

    if (!deletedUser) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(deletedUser)
  }
}
