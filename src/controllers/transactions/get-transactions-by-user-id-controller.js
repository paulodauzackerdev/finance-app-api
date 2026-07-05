import { ok } from '../../helpers/http.js'

export class GetTransactionsByUserIdController {
  constructor(getTransactionsByUserIdUseCase) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
  }

  handle = async (req, res, next) => {
    try {
      const transactions = await this.getTransactionsByUserIdUseCase.execute(
        req.userId
      )

      return ok(res, transactions)
    } catch (error) {
      next(error)
    }
  }
}
