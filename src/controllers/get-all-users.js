import { internalServerError, ok } from '../helpers/http.js'
export class GetAllUsersController {
  constructor(getAllUsersUseCase) {
    this.getAllUsersUseCase = getAllUsersUseCase
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
