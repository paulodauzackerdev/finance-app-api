import { ok } from '../helpers/http.js'

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

  handle = async (req, res) => {
    const { id } = req.params

    const user = await this.getUserByIdUseCase.execute(id)

    return ok(res, user)
  }
}
