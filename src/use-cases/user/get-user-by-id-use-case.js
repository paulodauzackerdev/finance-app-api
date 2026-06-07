import { removePasswordFromUser } from '../../helpers/user.js'

import { validateUserId } from '../../validators/user/index.js'

import { UserNotFoundError } from '../../errors/user.js'

export class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    validateUserId(userId)

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(user)
  }
}
