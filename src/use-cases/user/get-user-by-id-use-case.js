import { removePasswordFromUser } from '../../helpers/user.js'

import { userIdSchema } from '../../schemas/user/user.schema.js'

import {
  UserNotFoundError,
  ForbiddenUserAccessError
} from '../../errors/user.js'

export class GetUserByIdUseCase {
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

    const user = await this.userRepository.findById(validatedUserId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(user)
  }
}
