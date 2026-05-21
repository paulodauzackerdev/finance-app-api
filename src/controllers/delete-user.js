import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
  ok
} from '../helpers/http.js'

import {
  UserNotFoundError,
  InvalidUserIdError,
  ForbiddenUserDeletionError
} from '../errors/user.js'

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async handle(req, res) {
    try {
      const { id } = req.params

      const deletedUser = await this.deleteUserUseCase.execute(id)

      return ok(res, {
        message: 'User deleted successfully',
        user: deletedUser
      })
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(res, error.message)
      }

      if (error instanceof InvalidUserIdError) {
        return badRequest(res, error.message)
      }

      if (error instanceof ForbiddenUserDeletionError) {
        return forbidden(res, error.message)
      }

      console.error(error)
      return internalServerError(res)
    }
  }
}
