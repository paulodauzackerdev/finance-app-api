import { ok } from '../../helpers/http.js'

export class SoftDeleteUserController {
  constructor(softDeleteUserUseCase) {
    this.softDeleteUserUseCase = softDeleteUserUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params
      const deletedUser = await this.softDeleteUserUseCase.execute(id)
      return ok(res, {
        message: 'User deleted successfully',
        user: deletedUser
      })
    } catch (error) {
      next(error)
    }
  }
}
