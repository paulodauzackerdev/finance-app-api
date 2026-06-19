import { ok } from '../../helpers/http.js'

export class SoftDeleteTransactionController {
  constructor(softDeleteTransactionUseCase) {
    this.softDeleteTransactionUseCase = softDeleteTransactionUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params

      const deletedTransaction =
        await this.softDeleteTransactionUseCase.execute(id)

      return ok(res, {
        message: 'Transaction deleted successfully',
        transaction: deletedTransaction
      })
    } catch (error) {
      next(error)
    }
  }
}
