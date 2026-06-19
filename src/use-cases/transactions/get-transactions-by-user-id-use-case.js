import { userIdSchema } from '../../schemas/user/user.schema.js'

import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
  constructor(transactionRepository, userRepository) {
    this.transactionRepository = transactionRepository
    this.userRepository = userRepository
  }

  async execute(userId) {
    const validatedUserId = userIdSchema.parse(userId)

    const user = await this.userRepository.findById(validatedUserId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transactions =
      await this.transactionRepository.findByUserId(validatedUserId)

    return transactions
  }
}
