import { ok } from '../../helpers/http.js'

export class RestoreUserController {
  constructor(restoreUserUseCase) {
    this.restoreUserUseCase = restoreUserUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params
      const restoredUser = await this.restoreUserUseCase.execute(id)
      return ok(res, {
        message: 'User restored successfully',
        user: restoredUser
      })
    } catch (error) {
      next(error)
    }
  }
}
