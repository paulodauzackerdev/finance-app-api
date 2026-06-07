import { validateUserId } from '../../validators/user/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
  constructor(transactionRepository, userRepository) {
    this.transactionRepository = transactionRepository
    this.userRepository = userRepository
  }

  async execute(userId) {
    const validatedUserId = validateUserId(userId)

    const user = await this.userRepository.findById(validatedUserId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transactions =
      await this.transactionRepository.findByUserId(validatedUserId)

    return transactions
  }
}
