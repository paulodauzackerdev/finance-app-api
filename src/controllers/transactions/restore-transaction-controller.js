import { ok } from '../../helpers/http.js'

export class RestoreTransactionController {
  constructor(restoreTransactionUseCase) {
    this.restoreTransactionUseCase = restoreTransactionUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params

      const restoredTransaction =
        await this.restoreTransactionUseCase.execute(id)

      return ok(res, {
        message: 'Transaction restored successfully',
        transaction: restoredTransaction
      })
    } catch (error) {
      next(error)
    }
  }
}
