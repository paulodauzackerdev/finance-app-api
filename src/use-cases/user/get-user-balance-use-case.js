import { validateUserId } from '../../validators/user/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceUseCase {
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

    const balance =
      await this.transactionRepository.getUserBalance(validatedUserId)

    return {
      user_id: validatedUserId,
      user_name: `${user.first_name} ${user.last_name}`,
      user_email: user.email,
      ...balance
    }
  }
}
