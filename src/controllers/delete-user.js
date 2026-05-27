import { ok } from '../helpers/http.js'

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async handle(req, res) {
    const { id } = req.params

    const deletedUser = await this.deleteUserUseCase.execute(id)

    return ok(res, {
      message: 'User deleted successfully',
      user: deletedUser
    })
  }
}
