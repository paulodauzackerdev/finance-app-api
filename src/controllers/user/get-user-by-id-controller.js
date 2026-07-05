import { ok } from '../../helpers/http.js'

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params

      const user = await this.getUserByIdUseCase.execute(
        id,
        req.userId,
        req.userRole
      )

      return ok(res, user)
    } catch (error) {
      next(error)
    }
  }
}
