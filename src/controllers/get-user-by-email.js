import { internalServerError, notFound, ok } from '../helpers/http.js'
import { GetUserByEmailUseCase } from '../use-cases/get-user-by-email.js'
import { UserNotFoundError } from '../errors/user.js'

export class GetUserByEmailController {
  constructor() {
    this.getUserByEmailUseCase = new GetUserByEmailUseCase()
  }

  async handle(req, res) {
    try {
      const { email } = req.params

      const user = await this.getUserByEmailUseCase.execute(email)

      return ok(res, user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(res, error.message)
      }

      console.error(error)
      return internalServerError(res)
    }
  }
}
