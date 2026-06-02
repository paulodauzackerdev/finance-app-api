import { ok } from '../../helpers/http.js'

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase
  }

  handle = async (req, res) => {
    const { transactionId } = req.params

    const deletedTransaction =
      await this.deleteTransactionUseCase.execute(transactionId)

    return ok(res, deletedTransaction)
  }
}
