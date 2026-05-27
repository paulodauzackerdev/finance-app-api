import validator from 'validator'

import { removePasswordFromUser } from '../../helpers/user.js'

import {
  UserNotFoundError,
  InvalidUserIdError,
  ForbiddenUserDeletionError
} from '../../errors/user.js'

export class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    if (!validator.isUUID(userId)) {
      throw new InvalidUserIdError()
    }

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
