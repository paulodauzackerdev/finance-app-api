import { removePasswordFromUser } from '../../helpers/user.js'

import { validateUserId } from '../../validators/user/index.js'

import {
  UserNotFoundError,
  ForbiddenUserDeletionError
} from '../../errors/user.js'

export class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    validateUserId(userId)

    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    if (existingUser.id === process.env.ADMIN_USER_ID) {
      throw new ForbiddenUserDeletionError()
    }

    const deletedUser = await this.userRepository.delete(userId)

    if (!deletedUser) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(deletedUser)
  }
}
