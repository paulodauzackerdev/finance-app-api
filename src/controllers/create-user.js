import {
  badRequest,
  conflict,
  created,
  internalServerError
} from '../helpers/http.js'

import { CreateUserUseCase } from '../use-cases/create-user.js'

import {
  UserAlreadyExistsError,
  InvalidNameError,
  InvalidLastNameError,
  InvalidEmailError,
  WeakPasswordError
} from '../errors/user.js'

export class CreateUserController {
  constructor() {
    this.createUserUseCase = new CreateUserUseCase()
  }

  async handle(req, res) {
    try {
      const user = await this.createUserUseCase.execute(req.body)

      return created(res, user)
    } catch (error) {
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
