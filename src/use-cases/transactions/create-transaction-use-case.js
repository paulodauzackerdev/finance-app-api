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

  async execute({
    user_id,
    name,
    amount,
    description,
    type,
    transaction_date
  }) {
    const validatedUserId = validateUserId(user_id)
    const validatedName = validateTransactionName(name)
    const validatedAmount = validateTransactionAmount(amount)
    const validatedType = validateTransactionType(type)
    const validatedDate = validateTransactionDate(transaction_date)
    const validatedDescription = validateTransactionDescription(description)

    const user = await this.userRepository.findById(validatedUserId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transaction = await this.transactionRepository.create({
      user_id: validatedUserId,
      name: validatedName,
      amount: validatedAmount,
      description: validatedDescription,
      type: validatedType,
      transaction_date: validatedDate
    })

    return transaction
  }
}
