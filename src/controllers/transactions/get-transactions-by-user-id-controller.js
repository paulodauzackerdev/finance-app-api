import { ok } from '../../helpers/http.js'

export class GetTransactionsByUserIdController {
  constructor(getTransactionsByUserIdUseCase) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
  }

  handle = async (req, res) => {
    const { userId } = req.query
    const transactions =
      await this.getTransactionsByUserIdUseCase.execute(userId)

    return ok(res, transactions)
  }
}
