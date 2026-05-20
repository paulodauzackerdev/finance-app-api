import {
  badRequest,
  internalServerError,
  notFound,
  ok
} from '../helpers/http.js'

import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'

import { UserNotFoundError, InvalidUserIdError } from '../errors/user.js'

export class GetUserByIdController {
  constructor() {
    this.getUserByIdUseCase = new GetUserByIdUseCase()
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
