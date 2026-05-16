import { badRequest, internalServerError, notFound, ok } from './helper.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import validator from 'validator'

export class GetUserByIdController {
  constructor() {
    this.getUserByIdUseCase = new GetUserByIdUseCase()
  }

  async handle(req, res) {
    try {
      const { userId } = req.params

      if (!userId || userId.trim().length === 0) {
        return badRequest(res, 'Missing param: userId')
      }

      const isValid = validator.isUUID(userId)
      if (!isValid) {
        return badRequest(res, `Invalid UUID format: ${userId}`)
      }

      const user = await this.getUserByIdUseCase.execute(userId)

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
