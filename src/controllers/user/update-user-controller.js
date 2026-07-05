// UpdateUserController.js
import { ok } from '../../helpers/http.js'

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await this.updateUserUseCase.execute(
        id,
        req.body,
        req.userId,
        req.userRole
      )
      return ok(res, user)
    } catch (error) {
      next(error)
    }
  }
}
