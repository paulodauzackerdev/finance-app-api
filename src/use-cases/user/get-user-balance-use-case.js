import { userIdSchema } from '../../schemas/user/user.schema.js'

import {
  UserNotFoundError,
  ForbiddenUserAccessError
} from '../../errors/user.js'

export class GetUserBalanceUseCase {
  constructor(transactionRepository, userRepository) {
    this.transactionRepository = transactionRepository
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

    const balance =
      await this.transactionRepository.getUserBalance(validatedUserId)

    return {
      userId: validatedUserId,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      balance
    }
  }
}
