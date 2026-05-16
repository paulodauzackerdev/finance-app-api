import { badRequest, internalServerError, notFound, ok } from './helper.js'
import { GetUserByEmailUseCase } from '../use-cases/get-user-by-email.js'
import validator from 'validator'

export class GetUserByEmailController {
  constructor() {
    this.getUserByEmailUseCase = new GetUserByEmailUseCase()
  }

  async handle(req, res) {
    try {
      let { email } = req.params

      if (!email || email.trim().length === 0) {
        return badRequest(res, 'Missing param: email')
      }

      email = email.trim().toLowerCase()

      if (!validator.isEmail(email)) {
        return badRequest(res, 'Invalid email format')
      }

      const user = await this.getUserByEmailUseCase.execute(email)
      return ok(res, user)
    } catch (error) {
      console.error(error)

      if (error.message === 'User not found') {
        return notFound(res, error.message)
      }
      return internalServerError(res)
    }
  }
}
