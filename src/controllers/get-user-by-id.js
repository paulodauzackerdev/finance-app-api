import {
  badRequest,
  internalServerError,
  notFound,
  ok
} from '../helpers/http.js'

import { UserNotFoundError, InvalidUserIdError } from '../errors/user.js'

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

  async handle(req, res) {
    try {
      const { id } = req.params

      const user = await this.getUserByIdUseCase.execute(id)

      return ok(res, user)
    } catch (error) {
      if (error instanceof InvalidUserIdError) {
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
