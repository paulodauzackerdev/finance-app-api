import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
  ok
} from './helper.js'

import { DeleteUserUseCase } from '../use-cases/delete-user.js'

import {
  UserNotFoundError,
  InvalidUserIdError,
  ForbiddenUserDeletionError
} from '../errors/user.js'

export class DeleteUserController {
  constructor() {
    this.deleteUserUseCase = new DeleteUserUseCase()
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
