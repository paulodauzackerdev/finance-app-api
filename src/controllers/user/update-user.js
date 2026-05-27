import { ok } from '../../helpers/http.js'

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }

  handle = async (req, res) => {
    const { id } = req.params

    const user = await this.updateUserUseCase.execute(id, req.body)

    return ok(res, user)
  }
}
