import { ok } from '../../helpers/http.js'

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  handle = async (req, res, next) => {
    try {
      const { id } = req.params
      const deletedUser = await this.deleteUserUseCase.execute(id)
      return ok(res, {
        message: 'User deleted successfully',
        user: deletedUser
      })
    } catch (error) {
      next(error)
    }
  }
}
