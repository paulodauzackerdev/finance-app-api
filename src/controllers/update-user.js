import {
  badRequest,
  notFound,
  conflict,
  ok,
  internalServerError
} from './helper.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidNameError,
  InvalidLastNameError,
  InvalidEmailError,
  WeakPasswordError
} from '../errors/user.js'

export class UpdateUserController {
  constructor() {
    this.updateUserUseCase = new UpdateUserUseCase()
  }

  async handle(req, res) {
    try {
      const { id } = req.params
      const user = await this.updateUserUseCase.execute(id, req.body)

      return ok(res, user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(res, error.message)
      }

      if (error instanceof UserAlreadyExistsError) {
        return conflict(res, error.message)
      }

      if (
        error instanceof InvalidNameError ||
        error instanceof InvalidLastNameError ||
        error instanceof InvalidEmailError ||
        error instanceof WeakPasswordError
      ) {
        return badRequest(res, error.message)
      }

      console.error(error)
      return internalServerError(res)
    }
  }
}
