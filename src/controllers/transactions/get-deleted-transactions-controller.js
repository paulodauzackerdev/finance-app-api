import { ok } from '../../helpers/http.js'

export class GetDeletedTransactionsController {
  constructor(getDeletedTransactionsUseCase) {
    this.getDeletedTransactionsUseCase = getDeletedTransactionsUseCase
  }

  handle = async (req, res, next) => {
    try {
      const deletedTransactions =
        await this.getDeletedTransactionsUseCase.execute()
      return ok(res, deletedTransactions)
    } catch (error) {
      next(error)
    }
  }
}
