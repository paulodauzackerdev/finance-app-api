import { ok } from '../../helpers/http.js'

export class GetAllTransactionsController {
  constructor(getAllTransactionsUseCase) {
    this.getAllTransactionsUseCase = getAllTransactionsUseCase
  }

  handle = async (req, res) => {
    const transactions = await this.getAllTransactionsUseCase.execute()

    return ok(res, transactions)
  }
}
