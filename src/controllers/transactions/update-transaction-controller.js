import { ok } from '../../helpers/http.js'

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params

      const updateParams = req.body

      const updatedTransaction = await this.updateTransactionUseCase.execute(
        id,
        updateParams
      )

      return ok(res, updatedTransaction)
    } catch (error) {
      next(error)
    }
  }
}
