import { createTransactionInputSchema } from '../../schemas/transaction/transaction.schema.js'

import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
  constructor(transactionRepository, userRepository) {
    this.transactionRepository = transactionRepository
    this.userRepository = userRepository
  }

  async execute(createParams) {
    const { userId, name, amount, description, type, transactionDate } =
      createTransactionInputSchema.parse(createParams)

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transaction = await this.transactionRepository.create({
      userId,
      name,
      amount,
      description,
      type,
      transactionDate
    })

    return transaction
  }
}
