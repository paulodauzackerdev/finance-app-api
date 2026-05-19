import validator from 'validator'

import { UserRepository } from '../repositories/postgres/postgres-user-repository.js'

import { UserNotFoundError, InvalidUserIdError } from '../errors/user.js'

export class GetUserByIdUseCase {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute(userId) {
    if (!validator.isUUID(userId)) {
      throw new InvalidUserIdError()
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }
}
