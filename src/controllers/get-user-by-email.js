import {
  badRequest,
  internalServerError,
  notFound,
  ok
} from '../helpers/http.js'

import { UserNotFoundError, InvalidEmailError } from '../errors/user.js'

export class GetUserByEmailController {
  constructor(getUserByEmailUseCase) {
    this.getUserByEmailUseCase = getUserByEmailUseCase
  }

  async handle(req, res) {
    try {
      const { email } = req.params

      const user = await this.getUserByEmailUseCase.execute(email)

      return ok(res, user)
    } catch (error) {
      if (error instanceof InvalidEmailError) {
        return badRequest(res, error.message)
      }
      if (error instanceof UserNotFoundError) {
        return notFound(res, error.message)
      }

      console.error(error)
      return internalServerError(res)
    }
  }
}
