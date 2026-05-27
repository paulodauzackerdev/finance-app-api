import { ok } from '../helpers/http.js'

export class GetAllUsersController {
  constructor(getAllUsersUseCase) {
    this.getAllUsersUseCase = getAllUsersUseCase
  }

  handle = async (req, res) => {
    const users = await this.getAllUsersUseCase.execute()

    return ok(res, users)
  }
}
