import { ok } from '../../helpers/http.js'

export class GetDeletedTransactionsByUserIdController {
  constructor(getDeletedTransactionsByUserIdUseCase) {
    this.getDeletedTransactionsByUserIdUseCase =
      getDeletedTransactionsByUserIdUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { userId } = req.params
      const transactions =
        await this.getDeletedTransactionsByUserIdUseCase.execute(userId)

      return ok(res, transactions)
    } catch (error) {
      next(error)
    }
  }
}
