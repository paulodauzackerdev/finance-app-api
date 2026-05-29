import validator from 'validator'

import { UserNotFoundError, InvalidUserIdError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
  constructor(transactionRepository, userRepository) {
    this.transactionRepository = transactionRepository
    this.userRepository = userRepository
  }

  async execute(userId) {
    if (!userId) {
      throw new InvalidUserIdError('User ID is required')
    }

    if (!validator.isUUID(userId)) {
      throw new InvalidUserIdError()
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transactions = await this.transactionRepository.findByUserId(userId)

    return transactions
  }
}
