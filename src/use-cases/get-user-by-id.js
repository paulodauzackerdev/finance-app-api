import validator from 'validator'

import { UserNotFoundError, InvalidUserIdError } from '../errors/user.js'

import { removePasswordFromUser } from '../helpers/user.js'

export class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    if (!validator.isUUID(userId)) {
      throw new InvalidUserIdError()
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(user)
  }
}
