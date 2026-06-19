import { removePasswordFromUser } from '../../helpers/user.js'

import { userIdSchema } from '../../schemas/user/user.schema.js'

import { UserNotFoundError } from '../../errors/user.js'

export class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    const validatedUserId = userIdSchema.parse(userId)

    const user = await this.userRepository.findById(validatedUserId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return removePasswordFromUser(user)
  }
}
