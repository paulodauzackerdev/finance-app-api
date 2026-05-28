import { ok } from '../../helpers/http.js'

export class GetUserByEmailController {
  constructor(getUserByEmailUseCase) {
    this.getUserByEmailUseCase = getUserByEmailUseCase
  }

  handle = async (req, res) => {
    const { email } = req.params

    const user = await this.getUserByEmailUseCase.execute(email)

    return ok(res, user)
  }
}
