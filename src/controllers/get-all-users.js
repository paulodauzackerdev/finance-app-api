import { internalServerError, ok } from '../helpers/http.js'
import { GetAllUsersUseCase } from '../use-cases/get-all-users.js'

export class GetAllUsersController {
  constructor() {
    this.getAllUsersUseCase = new GetAllUsersUseCase()
  }

  async handle(req, res) {
    try {
      const users = await this.getAllUsersUseCase.execute()

      return ok(res, users)
    } catch (error) {
      console.error(error)

      return internalServerError(res)
    }
  }
}
