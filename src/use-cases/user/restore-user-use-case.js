import { removePasswordFromUser } from '../../helpers/user.js'

import { userIdSchema } from '../../schemas/user/user.schema.js'

import { UserNotFoundError } from '../../errors/user.js'

export class RestoreUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    const validatedUserId = userIdSchema.parse(userId)

    // Busca incluindo deletados para encontrar o usuário mesmo que soft-deleted
    const existingUser = await this.userRepository.findById(
      validatedUserId,
      true
    )

    if (!existingUser) {
      throw new UserNotFoundError()
    }

    if (!existingUser.deletedAt) {
      throw new UserNotFoundError('User is not deleted')
    }

    const restoredUser = await this.userRepository.restore(validatedUserId)

    return removePasswordFromUser(restoredUser)
  }
}
