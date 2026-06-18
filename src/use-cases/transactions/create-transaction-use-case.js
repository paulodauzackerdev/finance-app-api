import { validateUserId } from '../../validators/user/index.js'
import {
  validateTransactionName,
  validateTransactionAmount,
  validateTransactionType,
  validateTransactionDate,
  validateTransactionDescription
} from '../../validators/transaction/index.js'

import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
  constructor(transactionRepository, userRepository) {
    this.transactionRepository = transactionRepository
    this.userRepository = userRepository
  }

  async execute({ userId, name, amount, description, type, transactionDate }) {
    const validatedUserId = validateUserId(userId)
    const validatedName = validateTransactionName(name)
    const validatedAmount = validateTransactionAmount(amount)
    const validatedType = validateTransactionType(type)
    const validatedDate = validateTransactionDate(transactionDate)
    const validatedDescription = validateTransactionDescription(description)

    const user = await this.userRepository.findById(validatedUserId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transaction = await this.transactionRepository.create({
      userId: validatedUserId,
      name: validatedName,
      amount: validatedAmount,
      description: validatedDescription,
      type: validatedType,
      transactionDate: validatedDate
    })

    return transaction
  }
}
