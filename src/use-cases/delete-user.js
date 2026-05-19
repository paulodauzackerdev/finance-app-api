import validator from 'validator'

import { UserRepository } from '../repositories/postgres/postgres-user-repository.js'

import {
  UserNotFoundError,
  InvalidUserIdError,
  ForbiddenUserDeletionError
} from '../errors/user.js'

export class DeleteUserUseCase {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute(userId) {
    if (!validator.isUUID(userId)) {
      throw new InvalidUserIdError()
    }

    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    if (existingUser.email === 'admin@email.com') {
      throw new ForbiddenUserDeletionError()
    }

    const deletedUser = await this.userRepository.delete(userId)

    if (!deletedUser) {
      throw new UserNotFoundError()
    }

    const { password_hash: passwordHash, ...userWithoutPassword } = deletedUser

    void passwordHash

    return userWithoutPassword
  }
}
