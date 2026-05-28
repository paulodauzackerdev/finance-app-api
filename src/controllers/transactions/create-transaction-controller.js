import { created } from '../../helpers/http.js'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  handle = async (req, res) => {
    const transaction = await this.createTransactionUseCase.execute(req.body)

    return created(res, transaction)
  }
}
