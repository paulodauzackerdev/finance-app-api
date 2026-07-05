import { created } from '../../helpers/http.js'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  handle = async (req, res, next) => {
    try {
      const transaction = await this.createTransactionUseCase.execute({
        ...req.body,
        userId: req.userId
      })

      return created(res, {
        message: 'Transaction created successfully',
        transaction: transaction
      })
    } catch (error) {
      next(error)
    }
  }
}
