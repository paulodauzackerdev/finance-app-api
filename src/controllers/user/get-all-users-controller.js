import { ok } from '../../helpers/http.js'

export class GetAllUsersController {
  constructor(getAllUsersUseCase) {
    this.getAllUsersUseCase = getAllUsersUseCase
  }

  handle = async (req, res, next) => {
    try {
      const users = await this.getAllUsersUseCase.execute()
      return ok(res, users)
    } catch (error) {
      next(error)
    }
  }
}
