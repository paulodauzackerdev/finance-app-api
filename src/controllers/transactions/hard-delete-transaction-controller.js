import { ok } from '../../helpers/http.js'

export class HardDeleteTransactionController {
  constructor(hardDeleteTransactionUseCase) {
    this.hardDeleteTransactionUseCase = hardDeleteTransactionUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params

      const deletedTransaction =
        await this.hardDeleteTransactionUseCase.execute(id)

      return ok(res, {
        message: 'Transaction permanently deleted successfully',
        transaction: deletedTransaction
      })
    } catch (error) {
      next(error)
    }
  }
}
